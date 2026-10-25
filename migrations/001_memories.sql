CREATE TABLE IF NOT EXISTS memories (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Our moments',
  memory_date DATE,
  storage_key TEXT NOT NULL,
  content_type TEXT NOT NULL,
  bytes INTEGER NOT NULL DEFAULT 0,
  uploaded_by TEXT NOT NULL,
  uploaded_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)