use crate::db::migrations::run_migrations;
use anyhow::{Context, Result};
use rusqlite::Connection;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

pub struct LocalDB {
    conn: Arc<Mutex<Connection>>,
}

impl LocalDB {
    fn run_migrations(&self) -> Result<()> {
        run_migrations(&self.conn)
    }

    pub fn new_conn(db_path: PathBuf) -> Result<Self> {
        let conn = Connection::open(&db_path)?;

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

    pub fn get_conn(&self) -> Arc<Mutex<Connection>> {
        Arc::clone(&self.conn)
    }
}
