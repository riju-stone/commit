use tauri::State;

use crate::db::{notes, whiteboard};
use crate::model::db::DbState;
use crate::model::db::{Note, WhiteboardSnapshot};

// Notes Commands
#[tauri::command]
pub fn db_create_note(state: State<DbState>, note: Note) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    notes::create_note(&conn, note).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_update_note(state: State<DbState>, note: Note) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    notes::update_note(&conn, note).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_upsert_note(state: State<DbState>, note: Note) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    notes::upsert_note(&conn, note).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_get_note(state: State<DbState>, id: String) -> Result<Option<Note>, String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    notes::get_note(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_get_all_notes(state: State<DbState>) -> Result<Vec<Note>, String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    notes::get_all_notes(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_delete_note(state: State<DbState>, id: String) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    notes::delete_note(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_batch_upsert_notes(state: State<DbState>, notes_list: Vec<Note>) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    notes::batch_upsert_notes(&conn, notes_list).map_err(|e| e.to_string())
}

// Whiteboard Snapshots Commands
#[tauri::command]
pub fn db_create_snapshot(
    state: State<DbState>,
    snapshot: WhiteboardSnapshot,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    whiteboard::create_snapshot(&conn, snapshot).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_update_snapshot(
    state: State<DbState>,
    snapshot: WhiteboardSnapshot,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    whiteboard::update_snapshot(&conn, snapshot).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_upsert_snapshot(
    state: State<DbState>,
    snapshot: WhiteboardSnapshot,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    whiteboard::upsert_snapshot(&conn, snapshot).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_get_snapshot(
    state: State<DbState>,
    id: String,
) -> Result<Option<WhiteboardSnapshot>, String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    whiteboard::get_snapshot(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_get_all_snapshots(state: State<DbState>) -> Result<Vec<WhiteboardSnapshot>, String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    whiteboard::get_all_snapshots(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_delete_snapshot(state: State<DbState>, id: String) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let conn = db.get_conn();
    whiteboard::delete_snapshot(&conn, &id).map_err(|e| e.to_string())
}
