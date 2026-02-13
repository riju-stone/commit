// Function to create a folder in a given path
#[tauri::command]
pub fn create_folder(path: &str) -> Result<(), String> {
    std::fs::create_dir_all(path).map_err(|e| e.to_string())?;
    Ok(())
}

// Function to delete a folder in a given path
#[tauri::command]
pub fn delete_folder(path: &str) -> Result<(), String> {
    std::fs::remove_dir_all(path).map_err(|e| e.to_string())?;
    Ok(())
}

// Function to check if a folder exists in a given path
#[tauri::command]
pub fn folder_exists(path: &str) -> bool {
    std::path::Path::new(path).exists()
}

// Function to read the contents of a folder in a given path
#[tauri::command]
pub fn read_folder(path: &str) -> Result<Vec<String>, String> {
    let mut entries = Vec::new();
    for entry in std::fs::read_dir(path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        entries.push(entry.file_name().to_string_lossy().to_string());
    }
    Ok(entries)
}

// Function to create a file in a given path
#[tauri::command]
pub fn create_file(path: &str) -> Result<(), String> {
    std::fs::File::create(path).map_err(|e| e.to_string())?;
    Ok(())
}

// Function to delete a file in a given path
#[tauri::command]
pub fn delete_file(path: &str) -> Result<(), String> {
    std::fs::remove_file(path).map_err(|e| e.to_string())?;
    Ok(())
}

// Function to check if a file exists in a given path
#[tauri::command]
pub fn file_exists(path: &str) -> bool {
    std::path::Path::new(path).exists()
}

// Function to generate an folder/file object structure in a given path
#[tauri::command]
pub fn get_folder_structure(path: &str) -> Result<serde_json::Value, String> {
    let mut structure = serde_json::Map::new();
    for entry in std::fs::read_dir(path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let file_name = entry.file_name().to_string_lossy().to_string();
        if entry.file_type().map_err(|e| e.to_string())?.is_dir() {
            structure.insert(
                file_name.clone(),
                get_folder_structure(&format!("{}/{}", path, file_name))?,
            );
        } else {
            // For files, also store extension as part of the structure
            let extension = entry
                .path()
                .extension()
                .and_then(|ext| ext.to_str())
                .unwrap_or("")
                .to_string();
            structure.insert(file_name, serde_json::Value::String(extension));
        }
    }
    Ok(serde_json::Value::Object(structure))
}
