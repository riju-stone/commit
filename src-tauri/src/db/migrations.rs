use anyhow::Result;
use rusqlite::Connection;
use std::sync::{Arc, Mutex};

// Define migrations using refinery
refinery::embed_migrations!("migrations");

pub fn run_migrations(conn: &Arc<Mutex<Connection>>) -> Result<()> {
    let mut conn = conn.lock().unwrap();
    migrations::runner().run(&mut *conn)?;
    Ok(())
}
