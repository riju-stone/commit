use anyhow::{Context, Result};
use chrono::Utc;
use rusqlite::Connection;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

pub mod migrations;
pub mod notes;
pub mod whiteboard;

pub struct Database {
    conn: Arc<Mutex<Connection>>,
}

impl Database {
    pub fn new(db_path: PathBuf) -> Result<Self> {
        let conn = Connection::open(&db_path).context("Failed to open database")?;

        // Enable foreign keys
        conn.execute("PRAGMA foreign_keys = ON", [])
            .context("Failed to enable foreign keys")?;

        let db = Self {
            conn: Arc::new(Mutex::new(conn)),
        };

        // Run migrations
        db.run_migrations()?;

        Ok(db)
    }

    fn run_migrations(&self) -> Result<()> {
        migrations::run_migrations(&self.conn)
    }

    pub fn get_connection(&self) -> Arc<Mutex<Connection>> {
        Arc::clone(&self.conn)
    }
}

// Helper function to get current timestamp
pub fn now() -> i64 {
    Utc::now().timestamp_millis()
}
