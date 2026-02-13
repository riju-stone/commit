use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct FileMetadata {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub is_file: bool,
    pub extension: Option<String>,
    pub children: Option<Vec<FileMetadata>>,
}

// Function to create a folder in a given path
#[tauri::command]
pub fn create_folder(path: &str) -> Result<(), String> {
    fs::create_dir_all(path).map_err(|e| e.to_string())?;
    Ok(())
}

// Function to delete a folder in a given path
#[tauri::command]
pub fn delete_folder(path: &str, recursive: bool) -> Result<(), String> {
    if recursive {
        fs::remove_dir_all(path).map_err(|e| e.to_string())?;
    } else {
        fs::remove_dir(path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

// Function to check if a folder exists in a given path
#[tauri::command]
pub fn folder_exists(path: &str) -> bool {
    Path::new(path).is_dir()
}

// Function to read the contents of a folder in a given path
#[tauri::command]
pub fn read_folder(path: &str) -> Result<Vec<String>, String> {
    let mut entries = Vec::new();
    for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        entries.push(entry.file_name().to_string_lossy().to_string());
    }
    Ok(entries)
}

// Function to create a file in a given path
#[tauri::command]
pub fn create_file(path: &str, content: Option<String>) -> Result<(), String> {
    if let Some(content) = content {
        fs::write(path, content).map_err(|e| e.to_string())?;
    } else {
        fs::File::create(path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

// Function to delete a file in a given path
#[tauri::command]
pub fn delete_file(path: &str) -> Result<(), String> {
    fs::remove_file(path).map_err(|e| e.to_string())?;
    Ok(())
}

// Function to check if a file exists in a given path
#[tauri::command]
pub fn file_exists(path: &str) -> bool {
    Path::new(path).is_file()
}

// Function to rename/move a file or folder
#[tauri::command]
pub fn rename_path(old_path: &str, new_path: &str) -> Result<(), String> {
    fs::rename(old_path, new_path).map_err(|e| e.to_string())?;
    Ok(())
}

// Function to copy a file
#[tauri::command]
pub fn copy_file(source: &str, destination: &str) -> Result<(), String> {
    fs::copy(source, destination).map_err(|e| e.to_string())?;
    Ok(())
}

// Function to read file content as text
#[tauri::command]
pub fn read_file_text(path: &str) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

// Function to read file content as bytes
#[tauri::command]
pub fn read_file_bytes(path: &str) -> Result<Vec<u8>, String> {
    fs::read(path).map_err(|e| e.to_string())
}

// Function to write text to a file
#[tauri::command]
pub fn write_file_text(path: &str, content: &str) -> Result<(), String> {
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

// Function to write bytes to a file
#[tauri::command]
pub fn write_file_bytes(path: &str, content: Vec<u8>) -> Result<(), String> {
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

// Function to get immediate children of a directory (one level only)
#[tauri::command]
pub fn get_directory_children(path: &str) -> Result<Vec<FileMetadata>, String> {
    let path_obj = Path::new(path);

    if !path_obj.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    if !path_obj.is_dir() {
        return Err(format!("Path is not a directory: {}", path));
    }

    let mut children = Vec::new();

    match fs::read_dir(path) {
        Ok(entries) => {
            for entry_result in entries {
                if let Ok(entry) = entry_result {
                    let child_path = entry.path();
                    let child_name = entry.file_name().to_string_lossy().to_string();

                    // Skip hidden files and folders (starting with .)
                    if child_name.starts_with('.') {
                        continue;
                    }

                    // Get metadata for this entry
                    if let Ok(metadata) = fs::metadata(&child_path) {
                        let extension = child_path
                            .extension()
                            .and_then(|ext| ext.to_str())
                            .map(|s| s.to_string());

                        children.push(FileMetadata {
                            name: child_name,
                            path: child_path.to_string_lossy().to_string(),
                            is_dir: metadata.is_dir(),
                            is_file: metadata.is_file(),
                            extension,
                            children: None, // Children not loaded yet
                        });
                    }
                }
            }
        }
        Err(e) => {
            return Err(format!("Failed to read directory: {}", e));
        }
    }

    // Sort: directories first, then files, alphabetically
    children.sort_by(|a, b| match (a.is_dir, b.is_dir) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    });

    Ok(children)
}

// Function to generate a folder/file object structure with metadata
#[tauri::command]
pub fn get_folder_structure(path: &str, max_depth: Option<i32>) -> Result<FileMetadata, String> {
    // Start from depth 1 so that max_depth represents actual levels below root
    get_folder_structure_recursive(path, max_depth.unwrap_or(10), 1)
}

fn get_folder_structure_recursive(
    path: &str,
    max_depth: i32,
    current_depth: i32,
) -> Result<FileMetadata, String> {
    let path_obj = Path::new(path);

    if !path_obj.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    let metadata = fs::metadata(path).map_err(|e| e.to_string())?;
    let file_name = path_obj
        .file_name()
        .unwrap_or(path_obj.as_os_str())
        .to_string_lossy()
        .to_string();

    let extension = path_obj
        .extension()
        .and_then(|ext| ext.to_str())
        .map(|s| s.to_string());

    let is_dir = metadata.is_dir();
    let is_file = metadata.is_file();

    // If it's a directory and we haven't exceeded max depth, get children
    let children = if is_dir && current_depth <= max_depth {
        let mut child_list = Vec::new();

        match fs::read_dir(path) {
            Ok(entries) => {
                for entry_result in entries {
                    match entry_result {
                        Ok(entry) => {
                            let child_path = entry.path();
                            let child_name = entry.file_name().to_string_lossy().to_string();

                            // Skip hidden files and folders (starting with .)
                            if child_name.starts_with('.') {
                                continue;
                            }

                            // Use child_path as a string reference
                            let child_path_str = child_path.to_string_lossy();
                            match get_folder_structure_recursive(
                                &child_path_str,
                                max_depth,
                                current_depth + 1,
                            ) {
                                Ok(child_metadata) => {
                                    child_list.push(child_metadata);
                                }
                                Err(e) => {
                                    // Log error but continue processing other entries
                                    eprintln!(
                                        "Warning: Failed to process {}: {}",
                                        child_path_str, e
                                    );
                                }
                            }
                        }
                        Err(e) => {
                            eprintln!("Warning: Failed to read directory entry: {}", e);
                        }
                    }
                }
            }
            Err(e) => {
                // Log error but don't fail - just return empty children
                eprintln!("Warning: Failed to read directory {}: {}", path, e);
            }
        }

        // Sort: directories first, then files, alphabetically
        child_list.sort_by(|a, b| match (a.is_dir, b.is_dir) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        });

        Some(child_list)
    } else {
        None
    };

    Ok(FileMetadata {
        name: file_name,
        path: path.to_string(),
        is_dir,
        is_file,
        extension,
        children,
    })
}
