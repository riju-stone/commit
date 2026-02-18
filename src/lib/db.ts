import { invoke } from "@tauri-apps/api/core";

// Type definitions matching Rust structs
export interface Note {
  id: string;
  title?: string;
  body?: string;
  body_format?: string;
  created_at: number;
  updated_at: number;
  is_starred: boolean;
  provider_id?: string;
  version: number;
  deleted: boolean;
  metadata?: string;
}

export interface Email {
  id: string;
  thread_id?: string;
  from_name?: string;
  from_email?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
  html_body?: string;
  date?: number;
  is_read: boolean;
  is_starred: boolean;
  labels?: string;
  attachments?: string;
  provider?: string;
  provider_id?: string;
  created_at: number;
  updated_at: number;
  dedup_key?: string;
  source_folder?: string;
}

export interface CalendarEvent {
  id: string;
  title?: string;
  description?: string;
  start_date?: number;
  end_date?: number;
  all_day: boolean;
  provider?: string;
  provider_id?: string;
  calendar_id?: string;
  recurrence?: string;
  reminders?: string;
  attendees?: string;
  created_at: number;
  updated_at: number;
  deleted: boolean;
  dedup_key?: string;
}

export interface WhiteboardSnapshot {
  id: string;
  title?: string;
  data: string;
  created_at: number;
  updated_at: number;
  deleted: boolean;
}

// Helper function to get current timestamp
export const now = (): number => Date.now();

// Notes API
export const dbCreateNote = async (note: Note): Promise<void> => {
  return invoke("db_create_note", { note });
};

export const dbUpdateNote = async (note: Note): Promise<void> => {
  return invoke("db_update_note", { note });
};

export const dbUpsertNote = async (note: Note): Promise<void> => {
  return invoke("db_upsert_note", { note });
};

export const dbGetNote = async (id: string): Promise<Note | null> => {
  return invoke("db_get_note", { id });
};

export const dbGetAllNotes = async (): Promise<Note[]> => {
  return invoke("db_get_all_notes");
};

export const dbDeleteNote = async (id: string): Promise<void> => {
  return invoke("db_delete_note", { id });
};

export const dbBatchUpsertNotes = async (notes: Note[]): Promise<void> => {
  return invoke("db_batch_upsert_notes", { notesList: notes });
};

// Emails API
export const dbCreateEmail = async (email: Email): Promise<void> => {
  return invoke("db_create_email", { email });
};

export const dbUpdateEmail = async (email: Email): Promise<void> => {
  return invoke("db_update_email", { email });
};

export const dbUpsertEmail = async (email: Email): Promise<void> => {
  return invoke("db_upsert_email", { email });
};

export const dbGetEmail = async (id: string): Promise<Email | null> => {
  return invoke("db_get_email", { id });
};

export const dbGetAllEmails = async (): Promise<Email[]> => {
  return invoke("db_get_all_emails");
};

export const dbGetEmailsByFolder = async (folder: string): Promise<Email[]> => {
  return invoke("db_get_emails_by_folder", { folder });
};

export const dbBatchUpsertEmails = async (emails: Email[]): Promise<void> => {
  return invoke("db_batch_upsert_emails", { emailsList: emails });
};

// Calendar Events API
export const dbCreateEvent = async (event: CalendarEvent): Promise<void> => {
  return invoke("db_create_event", { event });
};

export const dbUpdateEvent = async (event: CalendarEvent): Promise<void> => {
  return invoke("db_update_event", { event });
};

export const dbUpsertEvent = async (event: CalendarEvent): Promise<void> => {
  return invoke("db_upsert_event", { event });
};

export const dbGetEvent = async (id: string): Promise<CalendarEvent | null> => {
  return invoke("db_get_event", { id });
};

export const dbGetAllEvents = async (): Promise<CalendarEvent[]> => {
  return invoke("db_get_all_events");
};

export const dbGetEventsByDateRange = async (start: number, end: number): Promise<CalendarEvent[]> => {
  return invoke("db_get_events_by_date_range", { start, end });
};

export const dbDeleteEvent = async (id: string): Promise<void> => {
  return invoke("db_delete_event", { id });
};

export const dbBatchUpsertEvents = async (events: CalendarEvent[]): Promise<void> => {
  return invoke("db_batch_upsert_events", { eventsList: events });
};

// Whiteboard Snapshots API
export const dbCreateSnapshot = async (snapshot: WhiteboardSnapshot): Promise<void> => {
  return invoke("db_create_snapshot", { snapshot });
};

export const dbUpdateSnapshot = async (snapshot: WhiteboardSnapshot): Promise<void> => {
  return invoke("db_update_snapshot", { snapshot });
};

export const dbUpsertSnapshot = async (snapshot: WhiteboardSnapshot): Promise<void> => {
  return invoke("db_upsert_snapshot", { snapshot });
};

export const dbGetSnapshot = async (id: string): Promise<WhiteboardSnapshot | null> => {
  return invoke("db_get_snapshot", { id });
};

export const dbGetAllSnapshots = async (): Promise<WhiteboardSnapshot[]> => {
  return invoke("db_get_all_snapshots");
};

export const dbDeleteSnapshot = async (id: string): Promise<void> => {
  return invoke("db_delete_snapshot", { id });
};
