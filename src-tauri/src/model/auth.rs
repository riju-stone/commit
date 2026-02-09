use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;

/// OAuth token response (for our application)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: u64,
    pub token_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scope: Option<String>,
}

#[derive(Debug, Clone)]
pub struct OAuthConfig {
    pub client_id: String,
    pub client_secret: String,
    pub redirect_uri: String,
}

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
