use anyhow::{anyhow, Result};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::{AppHandle, Emitter, State, Window};
use tauri_plugin_oauth::{start_with_config, OauthConfig};
use tauri_plugin_store::StoreExt;
use tokio::sync::Mutex;

// ============================================================================
// Types & Constants
// ============================================================================

const TOKEN_STORE_KEY: &str = "gmail_tokens";
const STORE_FILENAME: &str = "tokens.store.json";
const GOOGLE_OAUTH_TOKEN_URL: &str = "https://oauth2.googleapis.com/token";

/// OAuth token response from Google
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: u64,
    pub token_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scope: Option<String>,
}

/// Stored token information with expiration timestamp
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StoredTokens {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: u64, // Unix timestamp in seconds
    pub token_type: String,
}

/// OAuth configuration for Google
#[derive(Debug, Clone)]
pub struct OAuthConfig {
    pub client_id: String,
    pub client_secret: String,
    pub redirect_uri: String,
}

/// Shared state for OAuth configuration
pub struct AuthState {
    config: Arc<Mutex<Option<OAuthConfig>>>,
}

impl AuthState {
    pub fn new() -> Self {
        Self {
            config: Arc::new(Mutex::new(None)),
        }
    }

    pub async fn set_config(&self, config: OAuthConfig) {
        let mut cfg = self.config.lock().await;
        *cfg = Some(config);
    }

    pub async fn get_config(&self) -> Option<OAuthConfig> {
        let cfg = self.config.lock().await;
        cfg.clone()
    }
}

impl Default for AuthState {
    fn default() -> Self {
        Self::new()
    }
}

// ============================================================================
// Token Storage Functions
// ============================================================================

/// Store tokens securely using Tauri's store plugin
async fn store_tokens_internal(app: &AppHandle, tokens: &StoredTokens) -> Result<()> {
    let store = app
        .store(STORE_FILENAME)
        .map_err(|e| anyhow!("Failed to get store: {}", e))?;

    store.set(TOKEN_STORE_KEY.to_string(), serde_json::to_value(tokens)?);
    store
        .save()
        .map_err(|e| anyhow!("Failed to save store: {}", e))?;

    Ok(())
}

/// Retrieve stored tokens from secure storage
async fn get_stored_tokens_internal(app: &AppHandle) -> Result<Option<StoredTokens>> {
    let store = app
        .store(STORE_FILENAME)
        .map_err(|e| anyhow!("Failed to get store: {}", e))?;

    if let Some(value) = store.get(TOKEN_STORE_KEY) {
        let tokens: StoredTokens = serde_json::from_value(value)
            .map_err(|e| anyhow!("Failed to deserialize tokens: {}", e))?;
        Ok(Some(tokens))
    } else {
        Ok(None)
    }
}

/// Clear stored tokens from secure storage
async fn clear_tokens_internal(app: &AppHandle) -> Result<()> {
    let store = app
        .store(STORE_FILENAME)
        .map_err(|e| anyhow!("Failed to get store: {}", e))?;

    let _ = store.delete(TOKEN_STORE_KEY);
    store
        .save()
        .map_err(|e| anyhow!("Failed to save store: {}", e))?;

    Ok(())
}

/// Check if token is expired or will expire soon (within 5 minutes)
fn is_token_expired(tokens: &StoredTokens) -> bool {
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let buffer_time = 300; // 5 minutes

    tokens.expires_at <= now + buffer_time
}

// ============================================================================
// OAuth Flow Functions
// ============================================================================

/// Exchange authorization code for access and refresh tokens
async fn exchange_code_for_tokens(code: &str, config: &OAuthConfig) -> Result<TokenResponse> {
    let client = Client::new();

    let params = [
        ("code", code),
        ("client_id", &config.client_id),
        ("client_secret", &config.client_secret),
        ("redirect_uri", &config.redirect_uri),
        ("grant_type", "authorization_code"),
    ];

    let response = client
        .post(GOOGLE_OAUTH_TOKEN_URL)
        .header("Content-Type", "application/x-www-form-urlencoded")
        .form(&params)
        .send()
        .await
        .map_err(|e| anyhow!("Token exchange request failed: {}", e))?;

    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_default();
        return Err(anyhow!("Token exchange failed: {}", error_text));
    }

    let token_response: TokenResponse = response
        .json()
        .await
        .map_err(|e| anyhow!("Failed to parse token response: {}", e))?;

    Ok(token_response)
}

/// Refresh access token using refresh token
async fn refresh_access_token_internal(
    refresh_token: &str,
    config: &OAuthConfig,
) -> Result<TokenResponse> {
    let client = Client::new();

    let params = [
        ("refresh_token", refresh_token),
        ("client_id", &config.client_id),
        ("client_secret", &config.client_secret),
        ("grant_type", "refresh_token"),
    ];

    let response = client
        .post(GOOGLE_OAUTH_TOKEN_URL)
        .header("Content-Type", "application/x-www-form-urlencoded")
        .form(&params)
        .send()
        .await
        .map_err(|e| anyhow!("Token refresh request failed: {}", e))?;

    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_default();
        return Err(anyhow!("Token refresh failed: {}", error_text));
    }

    let token_response: TokenResponse = response
        .json()
        .await
        .map_err(|e| anyhow!("Failed to parse refresh response: {}", e))?;

    Ok(token_response)
}

// ============================================================================
// Tauri Commands
// ============================================================================

/// Initialize OAuth configuration
#[tauri::command]
pub async fn init_oauth_config(
    auth_state: State<'_, AuthState>,
    client_id: String,
    client_secret: String,
    redirect_uri: String,
) -> Result<(), String> {
    let config = OAuthConfig {
        client_id,
        client_secret,
        redirect_uri,
    };

    auth_state.set_config(config).await;
    Ok(())
}

/// Start OAuth server and return the port number
#[tauri::command]
pub async fn start_oauth_server(window: Window) -> Result<u16, String> {
    let config = OauthConfig {
        ports: Some(vec![8000, 8001, 8002, 8003, 8004]),
        response: Some("OAuth process completed. You can close this window.".into()),
    };

    start_with_config(config, move |url| {
        // Verify the URL is from localhost (security check)
        if url.starts_with("http://localhost:") || url.starts_with("http://127.0.0.1:") {
            let _ = window.emit("oauth-redirect", url);
        }
    })
    .map_err(|err: std::io::Error| err.to_string())
}

/// Exchange authorization code for tokens
#[tauri::command]
pub async fn exchange_code(
    app: AppHandle,
    auth_state: State<'_, AuthState>,
    code: String,
) -> Result<TokenResponse, String> {
    let config = auth_state
        .get_config()
        .await
        .ok_or_else(|| "OAuth config not initialized. Call init_oauth_config first.".to_string())?;

    // Exchange code for tokens
    let token_response = exchange_code_for_tokens(&code, &config)
        .await
        .map_err(|e| e.to_string())?;

    // Calculate expiration timestamp
    let expires_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
        + token_response.expires_in;

    // Store tokens securely
    let stored_tokens = StoredTokens {
        access_token: token_response.access_token.clone(),
        refresh_token: token_response.refresh_token.clone(),
        expires_at,
        token_type: token_response.token_type.clone(),
    };

    store_tokens_internal(&app, &stored_tokens)
        .await
        .map_err(|e| format!("Failed to store tokens: {}", e))?;

    Ok(token_response)
}

/// Store tokens securely (called from frontend)
#[tauri::command]
pub async fn store_tokens(
    app: AppHandle,
    access_token: String,
    refresh_token: String,
    expires_at: u64,
    token_type: String,
) -> Result<(), String> {
    let tokens = StoredTokens {
        access_token,
        refresh_token,
        expires_at,
        token_type,
    };

    store_tokens_internal(&app, &tokens)
        .await
        .map_err(|e| e.to_string())
}

/// Retrieve stored tokens
#[tauri::command]
pub async fn get_stored_tokens(app: AppHandle) -> Result<Option<StoredTokens>, String> {
    get_stored_tokens_internal(&app)
        .await
        .map_err(|e| e.to_string())
}

/// Check if current token is expired
#[tauri::command]
pub async fn is_token_expired_cmd(app: AppHandle) -> Result<bool, String> {
    let tokens = get_stored_tokens_internal(&app)
        .await
        .map_err(|e| e.to_string())?;

    match tokens {
        Some(tokens) => Ok(is_token_expired(&tokens)),
        None => Ok(true), // No tokens = expired
    }
}

/// Refresh access token
#[tauri::command]
pub async fn refresh_access_token(
    app: AppHandle,
    auth_state: State<'_, AuthState>,
) -> Result<TokenResponse, String> {
    let config = auth_state
        .get_config()
        .await
        .ok_or_else(|| "OAuth config not initialized".to_string())?;

    let stored_tokens = get_stored_tokens_internal(&app)
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "No stored tokens found".to_string())?;

    // Refresh the token
    let token_response = refresh_access_token_internal(&stored_tokens.refresh_token, &config)
        .await
        .map_err(|e| e.to_string())?;

    // Calculate new expiration timestamp
    let expires_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
        + token_response.expires_in;

    // Update stored tokens with new access token
    let updated_tokens = StoredTokens {
        access_token: token_response.access_token.clone(),
        refresh_token: token_response.refresh_token.clone(),
        expires_at,
        token_type: token_response.token_type.clone(),
    };

    store_tokens_internal(&app, &updated_tokens)
        .await
        .map_err(|e| format!("Failed to update tokens: {}", e))?;

    Ok(token_response)
}

/// Get valid access token, refreshing if necessary
#[tauri::command]
pub async fn get_valid_access_token(
    app: AppHandle,
    auth_state: State<'_, AuthState>,
) -> Result<String, String> {
    let stored_tokens = get_stored_tokens_internal(&app)
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "No stored tokens found. Please authenticate.".to_string())?;

    // Check if token is expired or expiring soon
    if is_token_expired(&stored_tokens) {
        // Refresh the token
        let token_response = refresh_access_token(app, auth_state).await?;
        Ok(token_response.access_token)
    } else {
        Ok(stored_tokens.access_token)
    }
}

/// Clear stored tokens
#[tauri::command]
pub async fn clear_tokens(app: AppHandle) -> Result<(), String> {
    clear_tokens_internal(&app).await.map_err(|e| e.to_string())
}

/// Revoke tokens with Google and clear local storage
#[tauri::command]
pub async fn revoke_tokens(app: AppHandle) -> Result<(), String> {
    // Get stored tokens
    if let Ok(Some(tokens)) = get_stored_tokens_internal(&app).await {
        // Try to revoke with Google
        let client = Client::new();
        let revoke_url = format!(
            "https://oauth2.googleapis.com/revoke?token={}",
            tokens.access_token
        );

        if let Err(e) = client.post(&revoke_url).send().await {
            eprintln!("Failed to revoke token with Google: {}", e);
            // Continue to clear local storage even if revocation fails
        }
    }

    // Clear local storage
    clear_tokens_internal(&app).await.map_err(|e| e.to_string())
}
