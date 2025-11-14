-- Add theme-related columns to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS theme_id text,
ADD COLUMN IF NOT EXISTS theme_name text,
ADD COLUMN IF NOT EXISTS theme_colors jsonb,
ADD COLUMN IF NOT EXISTS theme_font text,
ADD COLUMN IF NOT EXISTS theme_style text;