use crate::model::auth::{OAuthConfig, TokenResponse};
use anyhow::{anyhow, Result};
use reqwest::Client;

const GOOGLE_OAUTH_TOKEN_URL: &str = "https://oauth2.googleapis.com/token";

/// Exchange authorization code for access and refresh tokens
pub async fn exchange_code_for_tokens(code: &str, config: &OAuthConfig) -> Result<TokenResponse> {
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

    let google_response: TokenResponse = response
        .json()
        .await
        .map_err(|e| anyhow!("Failed to parse token response: {}", e))?;

    // Calculate expiration timestamp
    let expires_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
        + google_response.expires_at;

    if google_response.refresh_token.is_empty() {
        return Err(anyhow!(
            "No refresh token received. Make sure to request offline access."
        ));
    }

    Ok(TokenResponse {
        access_token: google_response.access_token,
        refresh_token: google_response.refresh_token,
        expires_at,
        token_type: google_response.token_type,
        scope: google_response.scope,
    })
}

/// Refresh access token using refresh token
pub async fn refresh_access_token_internal(
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

    let google_response: TokenResponse = response
        .json()
        .await
        .map_err(|e| anyhow!("Failed to parse refresh response: {}", e))?;

    // Calculate expiration timestamp
    let expires_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
        + google_response.expires_at;

    Ok(TokenResponse {
        access_token: google_response.access_token,
        refresh_token: if google_response.refresh_token.is_empty() {
            refresh_token.to_string()
        } else {
            google_response.refresh_token
        },
        expires_at,
        token_type: google_response.token_type,
        scope: google_response.scope,
    })
}
