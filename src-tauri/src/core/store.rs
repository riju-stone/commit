use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

const TOKEN_STORE_KEY: &str = "gmail_tokens";
const STORE_FILENAME: &str = "tokens.store.json";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenStore {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: u64,
    pub token_type: String,
}

/// Store tokens securely using Tauri's store plugin
pub async fn store_tokens_internal(app: &AppHandle, tokens: &TokenStore) -> Result<()> {
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
pub async fn get_stored_tokens_internal(app: &AppHandle) -> Result<Option<TokenStore>> {
    let store = app
        .store(STORE_FILENAME)
        .map_err(|e| anyhow!("Failed to get store: {}", e))?;

    if let Some(value) = store.get(TOKEN_STORE_KEY) {
        let tokens: TokenStore = serde_json::from_value(value)
            .map_err(|e| anyhow!("Failed to deserialize tokens: {}", e))?;
        Ok(Some(tokens))
    } else {
        Ok(None)
    }
}

/// Clear stored tokens from secure storage
pub async fn clear_tokens_internal(app: &AppHandle) -> Result<()> {
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
pub fn is_token_expired(tokens: &TokenStore) -> bool {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let buffer_time = 300; // 5 minutes

    tokens.expires_at <= now + buffer_time
}
