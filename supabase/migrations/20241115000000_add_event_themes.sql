-- Add theme fields to events table for enhanced theming support
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS theme_id text,
ADD COLUMN IF NOT EXISTS theme_name text,
ADD COLUMN IF NOT EXISTS theme_colors jsonb,
ADD COLUMN IF NOT EXISTS theme_font text,
ADD COLUMN IF NOT EXISTS theme_style text;

-- Create index for theme queries
CREATE INDEX IF NOT EXISTS idx_events_theme_id ON events(theme_id);