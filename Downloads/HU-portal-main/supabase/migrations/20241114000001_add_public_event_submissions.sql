-- Add fields to support public event submissions
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS organizer_name text,
ADD COLUMN IF NOT EXISTS organizer_email text,
ADD COLUMN IF NOT EXISTS organizer_phone text,
ADD COLUMN IF NOT EXISTS submission_type text CHECK (submission_type IN ('authenticated', 'public')) DEFAULT 'authenticated',
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('draft', 'pending', 'approved', 'rejected')) DEFAULT 'draft';

-- Update existing events to have approved status
UPDATE events SET status = 'approved' WHERE is_published = true;

-- Create policy for public event submissions
CREATE POLICY "Public can submit events for approval" ON events
  FOR INSERT WITH CHECK (
    submission_type = 'public' AND 
    status = 'pending' AND
    organizer_name IS NOT NULL AND
    organizer_email IS NOT NULL
  );

-- Create policy for viewing pending events (for organizers)
CREATE POLICY "Organizers can view pending submissions" ON events
  FOR SELECT USING (
    status = 'pending' OR 
    status = 'approved' OR
    (submission_type = 'authenticated' AND is_published = true)
  );

-- Create policy for organizers to approve/reject public submissions
CREATE POLICY "Organizers can manage event submissions" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_organizer = true
    )
  );

-- Grant insert permission on events table for anonymous users
GRANT INSERT ON events TO anon;

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_submission_type ON events(submission_type);