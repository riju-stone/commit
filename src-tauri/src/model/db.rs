use crate::core::db::LocalDB;
use serde::{Deserialize, Serialize};
use std::clone::Clone;
use std::fmt::Debug;
use std::sync::{Arc, Mutex};

pub struct DbState {
    pub db: Arc<Mutex<LocalDB>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Note {
    pub id: String,
    pub title: Option<String>,
    pub body: Option<String>,
    pub body_format: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
    pub is_starred: bool,
    pub provider_id: Option<String>,
    pub version: i32,
    pub deleted: bool,
    pub metadata: Option<String>,
}

// Whiteboard snapshot models
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WhiteboardSnapshot {
    pub id: String,
    pub title: Option<String>,
    pub data: String,
    pub created_at: i64,
    pub updated_at: i64,
    pub deleted: bool,
}
