import { invoke } from "@tauri-apps/api/core";
import {
  readDir,
  readTextFile,
  readFile,
  writeTextFile,
  writeFile,
  create,
  mkdir,
  remove,
  exists,
  copyFile,
  rename,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";
import { JSX } from "react";

// Type definition matching the Rust FileMetadata struct
export interface FileMetadata {
  name: string;
  path: string;
  is_dir: boolean;
  is_file: boolean;
  extension: string | null;
  children: FileMetadata[] | null;
}

// === Backend Commands (using invoke to call Rust commands) ===

/**
 * Get comprehensive folder structure with metadata using backend command
 * @param path - The path to read
 * @param maxDepth - Maximum depth to traverse (default: 10, represents levels below root)
 */
export function generateFileObject(
  path: string = "/Users/rijustone/Documents/",
  maxDepth: number = 10,
): Promise<FileMetadata> {
  return invoke("get_folder_structure", { path, maxDepth });
}

/**
 * Get immediate children of a directory (one level only)
 * @param path - The directory path to read
 */
export function getDirectoryChildren(path: string): Promise<FileMetadata[]> {
  return invoke("get_directory_children", { path });
}

/**
 * Create a folder at the specified path
 */
export function createFolder(path: string): Promise<void> {
  return invoke("create_folder", { path });
}

/**
 * Delete a folder at the specified path
 * @param recursive - If true, deletes non-empty directories
 */
export function deleteFolder(path: string, recursive: boolean = false): Promise<void> {
  return invoke("delete_folder", { path, recursive });
}

/**
 * Check if a folder exists
 */
export function folderExists(path: string): Promise<boolean> {
  return invoke("folder_exists", { path });
}

/**
 * Read folder contents (names only)
 */
export function readFolderNames(path: string): Promise<string[]> {
  return invoke("read_folder", { path });
}

/**
 * Create a file with optional content
 */
export function createFile(path: string, content?: string): Promise<void> {
  return invoke("create_file", { path, content });
}

/**
 * Delete a file
 */
export function deleteFile(path: string): Promise<void> {
  return invoke("delete_file", { path });
}

/**
 * Check if a file exists
 */
export function fileExists(path: string): Promise<boolean> {
  return invoke("file_exists", { path });
}

/**
 * Rename or move a file/folder
 */
export function renamePath(oldPath: string, newPath: string): Promise<void> {
  return invoke("rename_path", { oldPath, newPath });
}

/**
 * Copy a file
 */
export function copyFilePath(source: string, destination: string): Promise<void> {
  return invoke("copy_file", { source, destination });
}

/**
 * Read file content as text
 */
export function readFileText(path: string): Promise<string> {
  return invoke("read_file_text", { path });
}

/**
 * Read file content as bytes
 */
export function readFileBytes(path: string): Promise<number[]> {
  return invoke("read_file_bytes", { path });
}

/**
 * Write text content to a file
 */
export function writeFileText(path: string, content: string): Promise<void> {
  return invoke("write_file_text", { path, content });
}

/**
 * Write bytes to a file
 */
export function writeFileBytes(path: string, content: number[]): Promise<void> {
  return invoke("write_file_bytes", { path, content });
}

// === Frontend FS Plugin Functions ===

/**
 * Read directory entries using Tauri FS plugin
 * @param path - Path relative to baseDir or absolute path
 * @param baseDir - Base directory to use (optional)
 */
export async function readDirectory(path: string, baseDir?: BaseDirectory) {
  return readDir(path, { baseDir });
}

/**
 * Read text file using Tauri FS plugin
 */
export async function readTextFileContent(path: string, baseDir?: BaseDirectory): Promise<string> {
  return readTextFile(path, { baseDir });
}

/**
 * Read binary file using Tauri FS plugin
 */
export async function readBinaryFile(path: string, baseDir?: BaseDirectory): Promise<Uint8Array> {
  return readFile(path, { baseDir });
}

/**
 * Write text file using Tauri FS plugin
 */
export async function writeTextFileContent(path: string, content: string, baseDir?: BaseDirectory): Promise<void> {
  return writeTextFile(path, content, { baseDir });
}

/**
 * Write binary file using Tauri FS plugin
 */
export async function writeBinaryFile(path: string, content: Uint8Array, baseDir?: BaseDirectory): Promise<void> {
  return writeFile(path, content, { baseDir });
}

/**
 * Create a file handle using Tauri FS plugin
 */
export async function createFileHandle(path: string, baseDir?: BaseDirectory) {
  return create(path, { baseDir });
}

/**
 * Create directory using Tauri FS plugin
 */
export async function createDirectory(path: string, baseDir?: BaseDirectory, recursive: boolean = true): Promise<void> {
  return mkdir(path, { baseDir, recursive });
}

/**
 * Remove file or directory using Tauri FS plugin
 */
export async function removePath(path: string, baseDir?: BaseDirectory, recursive: boolean = false): Promise<void> {
  return remove(path, { baseDir, recursive });
}

/**
 * Check if path exists using Tauri FS plugin
 */
export async function pathExists(path: string, baseDir?: BaseDirectory): Promise<boolean> {
  return exists(path, { baseDir });
}

/**
 * Copy file using Tauri FS plugin
 */
export async function copyFileFS(
  source: string,
  destination: string,
  fromPathBaseDir?: BaseDirectory,
  toPathBaseDir?: BaseDirectory,
): Promise<void> {
  return copyFile(source, destination, {
    fromPathBaseDir,
    toPathBaseDir,
  });
}

/**
 * Rename file or directory using Tauri FS plugin
 */
export async function renameFS(
  oldPath: string,
  newPath: string,
  oldPathBaseDir?: BaseDirectory,
  newPathBaseDir?: BaseDirectory,
): Promise<void> {
  return rename(oldPath, newPath, {
    oldPathBaseDir,
    newPathBaseDir,
  });
}

/**
 * Get file icon based on extension
 */
export function getFileIcon(extension: string | null): JSX.Element | string {
  if (!extension) return "📄";

  const iconMap: Record<string, JSX.Element | string> = {
    // Documents
    txt: "text",
    md: "text",
    pdf: "text",
    doc: "text",
    docx: "text",

    // Images
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
    svg: "image",

    // Code
    js: "code",
    ts: "code",
    jsx: "code",
    tsx: "code",
    py: "code",
    rs: "code",
    go: "code",
    java: "code",

    // Web
    html: "code",
    css: "code",
    json: "code",
    xml: "code",

    // Archive
    zip: "zip",
    rar: "zip",
    tar: "zip",
    gz: "zip",

    // Video
    mp4: "video",
    avi: "video",
    mkv: "video",

    // Audio
    mp3: "audio",
    wav: "audio",
    flac: "audio",
  };

  return iconMap[extension.toLowerCase()] || "📄";
}
