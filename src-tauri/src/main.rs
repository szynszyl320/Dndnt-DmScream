// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  // This fix handles the Wayland "Protocol Error" you saw earlier
    #[cfg(target_os = "linux")]
    std::env::set_var("GDK_BACKEND", "x11");
    std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");

    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application"); // <--- Check this lin
}
