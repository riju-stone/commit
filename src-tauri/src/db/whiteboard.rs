use super::now;
use crate::model::db::WhiteboardSnapshot;
use anyhow::{Context, Result};
use rusqlite::{params, Connection, OptionalExtension};
use std::sync::{Arc, Mutex};

pub fn create_snapshot(conn: &Arc<Mutex<Connection>>, snapshot: WhiteboardSnapshot) -> Result<()> {
    let conn = conn.lock().unwrap();

    conn.execute(
        "INSERT INTO whiteboard_snapshots (id, title, data, created_at, updated_at, deleted)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![
            snapshot.id,
            snapshot.title,
            snapshot.data,
            snapshot.created_at,
            snapshot.updated_at,
            snapshot.deleted as i32,
        ],
    )
    .context("Failed to insert whiteboard snapshot")?;

    Ok(())
}

pub fn update_snapshot(conn: &Arc<Mutex<Connection>>, snapshot: WhiteboardSnapshot) -> Result<()> {
    let conn = conn.lock().unwrap();

    conn.execute(
        "UPDATE whiteboard_snapshots SET title = ?2, data = ?3, updated_at = ?4, deleted = ?5
         WHERE id = ?1",
        params![
            snapshot.id,
            snapshot.title,
            snapshot.data,
            snapshot.updated_at,
            snapshot.deleted as i32,
        ],
    )
    .context("Failed to update whiteboard snapshot")?;

    Ok(())
}

pub fn upsert_snapshot(conn: &Arc<Mutex<Connection>>, snapshot: WhiteboardSnapshot) -> Result<()> {
    let conn = conn.lock().unwrap();

    conn.execute(
        "INSERT INTO whiteboard_snapshots (id, title, data, created_at, updated_at, deleted)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)
         ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            data = excluded.data,
            updated_at = excluded.updated_at,
            deleted = excluded.deleted",
        params![
            snapshot.id,
            snapshot.title,
            snapshot.data,
            snapshot.created_at,
            snapshot.updated_at,
            snapshot.deleted as i32,
        ],
    )
    .context("Failed to upsert whiteboard snapshot")?;

    Ok(())
}

pub fn get_snapshot(conn: &Arc<Mutex<Connection>>, id: &str) -> Result<Option<WhiteboardSnapshot>> {
    let conn = conn.lock().unwrap();

    let mut stmt = conn.prepare(
        "SELECT id, title, data, created_at, updated_at, deleted
         FROM whiteboard_snapshots WHERE id = ?1",
    )?;

    let snapshot = stmt
        .query_row(params![id], |row| {
            Ok(WhiteboardSnapshot {
                id: row.get(0)?,
                title: row.get(1)?,
                data: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
                deleted: row.get::<_, i32>(5)? != 0,
            })
        })
        .optional()?;

    Ok(snapshot)
}

pub fn get_all_snapshots(conn: &Arc<Mutex<Connection>>) -> Result<Vec<WhiteboardSnapshot>> {
    let conn = conn.lock().unwrap();

    let mut stmt = conn.prepare(
        "SELECT id, title, data, created_at, updated_at, deleted
         FROM whiteboard_snapshots WHERE deleted = 0 ORDER BY updated_at DESC",
    )?;

    let snapshots = stmt
        .query_map([], |row| {
            Ok(WhiteboardSnapshot {
                id: row.get(0)?,
                title: row.get(1)?,
                data: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
                deleted: row.get::<_, i32>(5)? != 0,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(snapshots)
}

pub fn delete_snapshot(conn: &Arc<Mutex<Connection>>, id: &str) -> Result<()> {
    let conn = conn.lock().unwrap();

    conn.execute(
        "UPDATE whiteboard_snapshots SET deleted = 1, updated_at = ?2 WHERE id = ?1",
        params![id, now()],
    )
    .context("Failed to delete whiteboard snapshot")?;

    Ok(())
}
