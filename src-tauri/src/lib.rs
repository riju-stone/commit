use tauri::WebviewWindowBuilder;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let window = WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::default())
                .title("")
                .inner_size(1024.0, 768.0)
                .resizable(true)
                .transparent(true)
                .decorations(true)
                .title_bar_style(tauri::TitleBarStyle::Overlay)
                .build().unwrap();

            #[cfg(target_os = "macos")]
            {
                use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};
                let blur = NSVisualEffectMaterial::FullScreenUI;

                apply_vibrancy(&window, blur, None, Some(15.0)).expect("Unable to apply vibrancy");
            }

            window.on_window_event(move |event| {
                 if let tauri::WindowEvent::CloseRequested { .. } = event {}
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
