use crate::core::auth::{exchange_code_for_tokens, refresh_access_token_internal};
use crate::core::store::{
    clear_tokens_internal, get_stored_tokens_internal, is_token_expired, store_tokens_internal,
    TokenStore,
};
use crate::model::auth::{AuthState, OAuthConfig, TokenResponse};
use reqwest::Client;
use tauri::{AppHandle, Emitter, State, Window};
use tauri_plugin_oauth::{start_with_config, OauthConfig};

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

    // Store tokens securely
    let stored_tokens = TokenStore {
        access_token: token_response.access_token.clone(),
        refresh_token: token_response.refresh_token.clone(),
        expires_at: token_response.expires_at,
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
    let tokens = TokenStore {
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
pub async fn get_stored_tokens(app: AppHandle) -> Result<Option<TokenStore>, String> {
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
        + token_response.expires_at;

    // Update stored tokens with new access token
    let updated_tokens = TokenStore {
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
