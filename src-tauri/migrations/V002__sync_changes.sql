-- Sync and change tracking tables

CREATE TABLE IF NOT EXISTS sync_changes (
  change_id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  op TEXT NOT NULL CHECK(op IN ('create','update','delete')),
  payload TEXT,
  client_clock INTEGER NOT NULL,
  server_clock INTEGER,
  synced INTEGER DEFAULT 0,
  retry_count INTEGER DEFAULT 0,
  last_attempt_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_sync_changes_synced ON sync_changes(synced);
CREATE INDEX IF NOT EXISTS idx_sync_changes_entity ON sync_changes(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS sync_checkpoints (
  source_id TEXT PRIMARY KEY,
  last_synced_at INTEGER,
  last_server_clock INTEGER,
  etag TEXT
);
