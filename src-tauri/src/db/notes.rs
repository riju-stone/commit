use crate::helper::format::now;
use crate::model::db::Note;
use anyhow::{Context, Result};
use rusqlite::{params, Connection, OptionalExtension};
use std::sync::{Arc, Mutex};

pub fn create_note(conn: &Arc<Mutex<Connection>>, note: Note) -> Result<()> {
    let conn = conn.lock().unwrap();

    conn.execute(
        "INSERT INTO notes (id, title, body, body_format, created_at, updated_at, is_starred, provider_id, version, deleted, metadata)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            note.id,
            note.title,
            note.body,
            note.body_format,
            note.created_at,
            note.updated_at,
            note.is_starred as i32,
            note.provider_id,
            note.version,
            note.deleted as i32,
            note.metadata,
        ],
    ).context("Failed to insert note")?;

    Ok(())
}

pub fn update_note(conn: &Arc<Mutex<Connection>>, note: Note) -> Result<()> {
    let conn = conn.lock().unwrap();

    conn.execute(
        "UPDATE notes SET title = ?2, body = ?3, body_format = ?4, updated_at = ?5, is_starred = ?6, provider_id = ?7, version = ?8, deleted = ?9, metadata = ?10
         WHERE id = ?1",
        params![
            note.id,
            note.title,
            note.body,
            note.body_format,
            note.updated_at,
            note.is_starred as i32,
            note.provider_id,
            note.version,
            note.deleted as i32,
            note.metadata,
        ],
    ).context("Failed to update note")?;

    Ok(())
}

pub fn upsert_note(conn: &Arc<Mutex<Connection>>, note: Note) -> Result<()> {
    let conn = conn.lock().unwrap();

    conn.execute(
        "INSERT INTO notes (id, title, body, body_format, created_at, updated_at, is_starred, provider_id, version, deleted, metadata)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
         ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            body = excluded.body,
            body_format = excluded.body_format,
            updated_at = excluded.updated_at,
            is_starred = excluded.is_starred,
            provider_id = excluded.provider_id,
            version = excluded.version,
            deleted = excluded.deleted,
            metadata = excluded.metadata",
        params![
            note.id,
            note.title,
            note.body,
            note.body_format,
            note.created_at,
            note.updated_at,
            note.is_starred as i32,
            note.provider_id,
            note.version,
            note.deleted as i32,
            note.metadata,
        ],
    ).context("Failed to upsert note")?;

    Ok(())
}

pub fn get_note(conn: &Arc<Mutex<Connection>>, id: &str) -> Result<Option<Note>> {
    let conn = conn.lock().unwrap();

    let mut stmt = conn.prepare(
        "SELECT id, title, body, body_format, created_at, updated_at, is_starred, provider_id, version, deleted, metadata
         FROM notes WHERE id = ?1"
    )?;

    let note = stmt
        .query_row(params![id], |row| {
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                body: row.get(2)?,
                body_format: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
                is_starred: row.get::<_, i32>(6)? != 0,
                provider_id: row.get(7)?,
                version: row.get(8)?,
                deleted: row.get::<_, i32>(9)? != 0,
                metadata: row.get(10)?,
            })
        })
        .optional()?;

    Ok(note)
}

pub fn get_all_notes(conn: &Arc<Mutex<Connection>>) -> Result<Vec<Note>> {
    let conn = conn.lock().unwrap();

    let mut stmt = conn.prepare(
        "SELECT id, title, body, body_format, created_at, updated_at, is_starred, provider_id, version, deleted, metadata
         FROM notes WHERE deleted = 0 ORDER BY updated_at DESC"
    )?;

    let notes = stmt
        .query_map([], |row| {
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                body: row.get(2)?,
                body_format: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
                is_starred: row.get::<_, i32>(6)? != 0,
                provider_id: row.get(7)?,
                version: row.get(8)?,
                deleted: row.get::<_, i32>(9)? != 0,
                metadata: row.get(10)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(notes)
}

pub fn delete_note(conn: &Arc<Mutex<Connection>>, id: &str) -> Result<()> {
    let conn = conn.lock().unwrap();

    conn.execute(
        "UPDATE notes SET deleted = 1, updated_at = ?2 WHERE id = ?1",
        params![id, now()],
    )
    .context("Failed to delete note")?;

    Ok(())
}

pub fn batch_upsert_notes(conn: &Arc<Mutex<Connection>>, notes: Vec<Note>) -> Result<()> {
    let mut conn = conn.lock().unwrap();
    let tx = conn.transaction()?;

    for note in notes {
        tx.execute(
            "INSERT INTO notes (id, title, body, body_format, created_at, updated_at, is_starred, provider_id, version, deleted, metadata)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
             ON CONFLICT(id) DO UPDATE SET
                title = excluded.title,
                body = excluded.body,
                body_format = excluded.body_format,
                updated_at = excluded.updated_at,
                is_starred = excluded.is_starred,
                provider_id = excluded.provider_id,
                version = excluded.version,
                deleted = excluded.deleted,
                metadata = excluded.metadata",
            params![
                note.id,
                note.title,
                note.body,
                note.body_format,
                note.created_at,
                note.updated_at,
                note.is_starred as i32,
                note.provider_id,
                note.version,
                note.deleted as i32,
                note.metadata,
            ],
        )?;
    }

    tx.commit()?;
    Ok(())
}
