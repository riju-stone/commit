-- Core content tables

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT,
  body TEXT,
  body_format TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  is_starred INTEGER DEFAULT 0,
  provider_id TEXT,
  version INTEGER DEFAULT 1,
  deleted INTEGER DEFAULT 0,
  metadata TEXT
);

CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);
CREATE INDEX IF NOT EXISTS idx_notes_deleted ON notes(deleted);

CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  thread_id TEXT,
  from_name TEXT,
  from_email TEXT,
  "to" TEXT,
  cc TEXT,
  bcc TEXT,
  subject TEXT,
  body TEXT,
  html_body TEXT,
  "date" INTEGER,
  is_read INTEGER DEFAULT 0,
  is_starred INTEGER DEFAULT 0,
  labels TEXT,
  attachments TEXT,
  provider TEXT,
  provider_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  dedup_key TEXT,
  source_folder TEXT
);

CREATE INDEX IF NOT EXISTS idx_emails_thread_id ON emails(thread_id);
CREATE INDEX IF NOT EXISTS idx_emails_date ON emails(date);
CREATE INDEX IF NOT EXISTS idx_emails_is_read ON emails(is_read);
CREATE INDEX IF NOT EXISTS idx_emails_dedup_key ON emails(dedup_key);

CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  start_date INTEGER,
  end_date INTEGER,
  all_day INTEGER DEFAULT 0,
  provider TEXT,
  provider_id TEXT,
  calendar_id TEXT,
  recurrence TEXT,
  reminders TEXT,
  attendees TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted INTEGER DEFAULT 0,
  dedup_key TEXT
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_calendar_id ON calendar_events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_deleted ON calendar_events(deleted);

CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  owner_type TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime TEXT,
  size INTEGER,
  path TEXT,
  hash TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attachments_owner ON attachments(owner_id, owner_type);

CREATE TABLE IF NOT EXISTS whiteboard_snapshots (
  id TEXT PRIMARY KEY,
  title TEXT,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_whiteboard_snapshots_updated_at ON whiteboard_snapshots(updated_at);
