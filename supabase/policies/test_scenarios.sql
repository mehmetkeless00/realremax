-- RLS Policy Test Scenarios
-- Bu dosya RLS politikalarının doğru çalıştığını test etmek için kullanılır

-- =====================================================
-- TEST DATA SETUP
-- =====================================================

-- Test users (these would be created through Supabase Auth)
-- Note: In real testing, you would use actual auth.uid() values

-- Test user 1 (regular user)
-- auth.uid() = '11111111-1111-1111-1111-111111111111'

-- Test user 2 (agent)
-- auth.uid() = '22222222-2222-2222-2222-222222222222'

-- Test user 3 (different agent)
-- auth.uid() = '33333333-3333-3333-3333-333333333333'

-- =====================================================
-- USERS TABLE TESTS
-- =====================================================

-- Test 1: User can view their own profile
-- Expected: SUCCESS
SELECT 'Test 1: User can view own profile' as test_name;
-- SET LOCAL ROLE = 'authenticated';
-- SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM users WHERE id = '11111111-1111-1111-1111-111111111111';

-- Test 2: User cannot view other user's profile
-- Expected: NO ROWS RETURNED
SELECT 'Test 2: User cannot view other profile' as test_name;
-- SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM users WHERE id = '22222222-2222-2222-2222-222222222222';

-- Test 3: Anonymous user can view public user data
-- Expected: SUCCESS (public data only)
SELECT 'Test 3: Anonymous can view public data' as test_name;
-- SET LOCAL ROLE = 'anon';
-- SELECT id, email, role FROM users;

-- =====================================================
-- AGENTS TABLE TESTS
-- =====================================================

-- Test 4: Agent can view their own profile
-- Expected: SUCCESS
SELECT 'Test 4: Agent can view own profile' as test_name;
-- SET LOCAL ROLE = 'authenticated';
-- SET LOCAL "request.jwt.claim.sub" = '22222222-2222-2222-2222-222222222222';
-- SELECT * FROM agents WHERE user_id = '22222222-2222-2222-2222-222222222222';

-- Test 5: Agent cannot view other agent's profile
-- Expected: NO ROWS RETURNED
SELECT 'Test 5: Agent cannot view other agent profile' as test_name;
-- SET LOCAL "request.jwt.claim.sub" = '22222222-2222-2222-2222-222222222222';
-- SELECT * FROM agents WHERE user_id = '33333333-3333-3333-3333-333333333333';

-- Test 6: Anonymous user can view public agent data
-- Expected: SUCCESS (public data only)
SELECT 'Test 6: Anonymous can view public agent data' as test_name;
-- SET LOCAL ROLE = 'anon';
-- SELECT id, name, company FROM agents;

-- =====================================================
-- PROPERTIES TABLE TESTS
-- =====================================================

-- Test 7: Anonymous user can view active properties
-- Expected: SUCCESS (only active properties)
SELECT 'Test 7: Anonymous can view active properties' as test_name;
-- SET LOCAL ROLE = 'anon';
-- SELECT * FROM properties WHERE status = 'active';

-- Test 8: Anonymous user cannot view inactive properties
-- Expected: NO ROWS RETURNED
SELECT 'Test 8: Anonymous cannot view inactive properties' as test_name;
-- SET LOCAL ROLE = 'anon';
-- SELECT * FROM properties WHERE status = 'pending';

-- Test 9: Agent can view all properties (including their own inactive ones)
-- Expected: SUCCESS (all properties)
SELECT 'Test 9: Agent can view all properties' as test_name;
-- SET LOCAL ROLE = 'authenticated';
-- SET LOCAL "request.jwt.claim.sub" = '22222222-2222-2222-2222-222222222222';
-- SELECT * FROM properties;

-- Test 10: Agent can only update their own properties
-- Expected: SUCCESS for own, FAILURE for others
SELECT 'Test 10: Agent can only update own properties' as test_name;
-- SET LOCAL ROLE = 'authenticated';
-- SET LOCAL "request.jwt.claim.sub" = '22222222-2222-2222-2222-222222222222';
-- UPDATE properties SET title = 'Updated Title' WHERE agent_id = 'agent-own-id';
-- UPDATE properties SET title = 'Updated Title' WHERE agent_id = 'other-agent-id';

-- =====================================================
-- FAVORITES TABLE TESTS
-- =====================================================

-- Test 11: User can view their own favorites
-- Expected: SUCCESS
SELECT 'Test 11: User can view own favorites' as test_name;
-- SET LOCAL ROLE = 'authenticated';
-- SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM favorites WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- Test 12: User cannot view other user's favorites
-- Expected: NO ROWS RETURNED
SELECT 'Test 12: User cannot view other favorites' as test_name;
-- SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM favorites WHERE user_id = '22222222-2222-2222-2222-222222222222';

-- Test 13: User can add property to their favorites
-- Expected: SUCCESS
SELECT 'Test 13: User can add to favorites' as test_name;
-- SET LOCAL ROLE = 'authenticated';
-- SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
-- INSERT INTO favorites (user_id, property_id) VALUES ('11111111-1111-1111-1111-111111111111', 'property-id');

-- Test 14: User cannot add property to other user's favorites
-- Expected: FAILURE
SELECT 'Test 14: User cannot add to other favorites' as test_name;
-- SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
-- INSERT INTO favorites (user_id, property_id) VALUES ('22222222-2222-2222-2222-222222222222', 'property-id');

-- =====================================================
-- INQUIRIES TABLE TESTS
-- =====================================================

-- Test 15: User can view their own inquiries
-- Expected: SUCCESS
SELECT 'Test 15: User can view own inquiries' as test_name;
-- SET LOCAL ROLE = 'authenticated';
-- SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM inquiries WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- Test 16: User cannot view other user's inquiries
-- Expected: NO ROWS RETURNED
SELECT 'Test 16: User cannot view other inquiries' as test_name;
-- SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM inquiries WHERE user_id = '22222222-2222-2222-2222-222222222222';

-- Test 17: Agent can view inquiries for their properties
-- Expected: SUCCESS
SELECT 'Test 17: Agent can view property inquiries' as test_name;
-- SET LOCAL ROLE = 'authenticated';
-- SET LOCAL "request.jwt.claim.sub" = '22222222-2222-2222-2222-222222222222';
-- SELECT * FROM inquiries WHERE property_id IN (
--   SELECT id FROM properties WHERE agent_id IN (
--     SELECT id FROM agents WHERE user_id = '22222222-2222-2222-2222-222222222222'
--   )
-- );

-- Test 18: Agent cannot view inquiries for other agent's properties
-- Expected: NO ROWS RETURNED
SELECT 'Test 18: Agent cannot view other property inquiries' as test_name;
-- SET LOCAL "request.jwt.claim.sub" = '22222222-2222-2222-2222-222222222222';
-- SELECT * FROM inquiries WHERE property_id IN (
--   SELECT id FROM properties WHERE agent_id IN (
--     SELECT id FROM agents WHERE user_id = '33333333-3333-3333-3333-333333333333'
--   )
-- );

-- =====================================================
-- AUDIT LOG TESTS
-- =====================================================

-- Test 19: Admin can view audit logs
-- Expected: SUCCESS
SELECT 'Test 19: Admin can view audit logs' as test_name;
-- SET LOCAL ROLE = 'authenticated';
-- SET LOCAL "request.jwt.claim.sub" = 'admin-user-id';
-- SELECT * FROM audit_logs;

-- Test 20: Regular user cannot view audit logs
-- Expected: NO ROWS RETURNED
SELECT 'Test 20: User cannot view audit logs' as test_name;
-- SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM audit_logs;

-- =====================================================
-- HELPER FUNCTIONS TESTS
-- =====================================================

-- Test 21: is_agent function
-- Expected: TRUE for agent, FALSE for regular user
SELECT 'Test 21: is_agent function' as test_name;
-- SELECT is_agent('22222222-2222-2222-2222-222222222222'); -- Should return TRUE
-- SELECT is_agent('11111111-1111-1111-1111-111111111111'); -- Should return FALSE

-- Test 22: owns_property function
-- Expected: TRUE for own property, FALSE for others
SELECT 'Test 22: owns_property function' as test_name;
-- SELECT owns_property('22222222-2222-2222-2222-222222222222', 'own-property-id'); -- Should return TRUE
-- SELECT owns_property('22222222-2222-2222-2222-222222222222', 'other-property-id'); -- Should return FALSE

-- Test 23: owns_inquiry function
-- Expected: TRUE for own inquiry, FALSE for others
SELECT 'Test 23: owns_inquiry function' as test_name;
-- SELECT owns_inquiry('11111111-1111-1111-1111-111111111111', 'own-inquiry-id'); -- Should return TRUE
-- SELECT owns_inquiry('11111111-1111-1111-1111-111111111111', 'other-inquiry-id'); -- Should return FALSE

-- Test 24: agent_can_access_inquiry function
-- Expected: TRUE for own property inquiry, FALSE for others
SELECT 'Test 24: agent_can_access_inquiry function' as test_name;
-- SELECT agent_can_access_inquiry('22222222-2222-2222-2222-222222222222', 'own-property-inquiry-id'); -- Should return TRUE
-- SELECT agent_can_access_inquiry('22222222-2222-2222-2222-222222222222', 'other-property-inquiry-id'); -- Should return FALSE

-- =====================================================
-- SECURITY VALIDATION QUERIES
-- =====================================================

-- Check if RLS is enabled on all tables
SELECT 'RLS Status Check' as check_name;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'agents', 'properties', 'listings', 'favorites', 'inquiries', 'audit_logs')
ORDER BY tablename;

-- Check all policies
SELECT 'Policy Check' as check_name;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check audit triggers
SELECT 'Audit Trigger Check' as check_name;
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
  AND event_object_table IN ('properties', 'inquiries', 'favorites')
ORDER BY event_object_table, trigger_name; 