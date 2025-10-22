CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  caption_ai TEXT,
  note_user TEXT,
  exif JSONB NOT NULL DEFAULT '{}'::jsonb,
  place_auto JSONB,
  place_display JSONB,
  location_override JSONB,
  status TEXT NOT NULL DEFAULT 'processing',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,
  detail_only BOOLEAN DEFAULT FALSE,
  slideshow_interval_sec INTEGER DEFAULT 5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_user_id ON photos (user_id);
