use tauri::{Manager, WebviewWindowBuilder};

mod commands;
mod core;
mod db;
mod model;

use core::auth::{
    clear_tokens, exchange_code, get_stored_tokens, get_valid_access_token, init_oauth_config,
    is_token_expired_cmd, refresh_access_token, revoke_tokens, start_oauth_server, store_tokens,
    AuthState,
};

use commands::db::{
    db_batch_upsert_notes, db_create_note, db_create_snapshot, db_delete_note, db_delete_snapshot,
    db_get_all_notes, db_get_all_snapshots, db_get_note, db_get_snapshot, db_update_note,
    db_update_snapshot, db_upsert_note, db_upsert_snapshot, DbState,
};

use std::sync::{Arc, Mutex};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_oauth::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .manage(AuthState::new())
        .invoke_handler(tauri::generate_handler![
            start_oauth_server,
            init_oauth_config,
            exchange_code,
            store_tokens,
            get_stored_tokens,
            is_token_expired_cmd,
            refresh_access_token,
            get_valid_access_token,
            clear_tokens,
            revoke_tokens,
            // Notes
            db_create_note,
            db_update_note,
            db_upsert_note,
            db_get_note,
            db_get_all_notes,
            db_delete_note,
            db_batch_upsert_notes,
            // Whiteboard
            db_create_snapshot,
            db_update_snapshot,
            db_upsert_snapshot,
            db_get_snapshot,
            db_get_all_snapshots,
            db_delete_snapshot,
        ])
        .setup(|app| {
            // Initialize database
            let app_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data dir");
            std::fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
            let db_path = app_dir.join("commit.db");

            let database = db::Database::new(db_path).expect("Failed to initialize database");

            let db_state = DbState {
                db: Arc::new(Mutex::new(database)),
            };

            app.manage(db_state);

            let window = WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::default())
                .title("")
                .inner_size(1024.0, 800.0)
                .min_inner_size(1024.0, 768.0)
                .resizable(true)
                .transparent(true)
                .decorations(true)
                .title_bar_style(tauri::TitleBarStyle::Overlay)
                .build()
                .unwrap();

            #[cfg(target_os = "macos")]
            {
                use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};
                let blur = NSVisualEffectMaterial::FullScreenUI;

                apply_vibrancy(&window, blur, None, Some(15.0)).expect("Unable to apply vibrancy");
            }

            window.on_window_event(
                move |event| {
                    if let tauri::WindowEvent::CloseRequested { .. } = event {}
                },
            );

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
