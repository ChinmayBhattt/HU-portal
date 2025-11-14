-- Add RLS policy to allow anonymous users to read published events
CREATE POLICY "Allow anonymous users to read published events" ON events
  FOR SELECT USING (
    is_published = true 
    AND status = 'approved'
  );

-- Add RLS policy to allow authenticated users to read all events they created
CREATE POLICY "Allow users to read their own events" ON events
  FOR SELECT USING (
    created_by = auth.uid() 
    OR submission_type = 'public'
  );

-- Grant select permission to anon role for published events
GRANT SELECT ON events TO anon;

-- Grant select permission to authenticated role for all events
GRANT SELECT ON events TO authenticated;