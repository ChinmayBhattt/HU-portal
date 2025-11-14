-- Test RLS policy for public event submissions
-- This should allow anonymous users to insert events with public submission type

-- Check current policies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'events';

-- Test insert as anonymous user
SET ROLE anon;

-- This should work with the public submission policy
INSERT INTO events (
  title, 
  description, 
  category, 
  date, 
  time, 
  location, 
  event_type, 
  max_capacity,
  meeting_url,
  banner_url,
  is_published,
  organizer_name,
  organizer_email,
  organizer_phone,
  submission_type,
  status
) VALUES (
  'Test Public Event',
  'This is a test event from anonymous user',
  'technology',
  '2024-12-01',
  '14:00',
  'Online',
  'online',
  50,
  'https://meet.google.com/test',
  null,
  false,
  'Test Organizer',
  'test@example.com',
  '+1234567890',
  'public',
  'pending'
);

-- Check if insert was successful
SELECT * FROM events WHERE title = 'Test Public Event';

-- Reset role
RESET ROLE;