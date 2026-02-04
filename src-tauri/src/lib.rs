use tauri::WebviewWindowBuilder;

mod core;

use core::auth::{
    clear_tokens, exchange_code, get_stored_tokens, get_valid_access_token, init_oauth_config,
    is_token_expired_cmd, refresh_access_token, revoke_tokens, start_oauth_server, store_tokens,
    AuthState,
};

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
        ])
        .setup(|app| {
            let window = WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::default())
                .title("")
                .inner_size(1280.0, 800.0)
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
