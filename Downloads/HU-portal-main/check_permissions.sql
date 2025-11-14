-- Check current permissions for events table
SELECT 
    grantee,
    privilege_type,
    table_name,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'events' 
AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;