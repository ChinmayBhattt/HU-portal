-- Add fields to support public event submissions
-- This migration assumes the events table already exists from the initial schema

-- Add new columns for public submissions
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS organizer_name text,
ADD COLUMN IF NOT EXISTS organizer_email text,
ADD COLUMN IF NOT EXISTS organizer_phone text,
ADD COLUMN IF NOT EXISTS submission_type text CHECK (submission_type IN ('authenticated', 'public')) DEFAULT 'authenticated',
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('draft', 'pending', 'approved', 'rejected')) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS full_description text,
ADD COLUMN IF NOT EXISTS start_date text,
ADD COLUMN IF NOT EXISTS end_date text,
ADD COLUMN IF NOT EXISTS location_type text,
ADD COLUMN IF NOT EXISTS max_attendees integer,
ADD COLUMN IF NOT EXISTS venue_details text,
ADD COLUMN IF NOT EXISTS requirements text,
ADD COLUMN IF NOT EXISTS what_to_bring text;

-- Update existing published events to approved status
UPDATE events SET status = 'approved' WHERE is_published = true;

-- Create policy for public event submissions (anonymous users)
CREATE POLICY "Public can submit events for approval" ON events
  FOR INSERT WITH CHECK (
    submission_type = 'public' AND 
    status = 'pending' AND
    organizer_name IS NOT NULL AND
    organizer_email IS NOT NULL
  );

-- Grant insert permission on events table for anonymous users
GRANT INSERT ON events TO anon;

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_submission_type ON events(submission_type);