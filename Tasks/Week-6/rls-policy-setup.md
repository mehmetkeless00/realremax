### Task: PostgreSQL Row-Level Security Rules

**Description & Context:**
Add and document detailed RLS policies for `properties`, `favorites`, and `inquiries` tables in Supabase. Provide both Supabase UI and SQL examples. Connect to the `role-based-access-control.md` task.

**Technology Stack:** Supabase PostgreSQL, SQL, Supabase UI

**Folder/File Path Suggestions:**

- `/supabase/policies/`
- `/docs/security.md`

**Dependencies:**

- Supabase schema and tables created
- See `role-based-access-control.md`

**Estimated Effort:** 3 hours

**Acceptance Criteria:**

- RLS policies are active for all sensitive tables
- Policies are documented and tested
- No unauthorized access possible

**Code Example:**

```sql
-- Example: Only allow agents to update their own properties
CREATE POLICY agent_update_own_properties ON properties
  FOR UPDATE TO authenticated
  USING (auth.uid() = agent_id);

-- Example: Only allow users to see their own favorites
CREATE POLICY user_own_favorites ON favorites
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Example: Only allow agents to see inquiries for their listings
CREATE POLICY agent_see_inquiries ON inquiries
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = inquiries.property_id AND properties.agent_id = auth.uid()));
```

// Reference: See also `role-based-access-control.md` and `/supabase/policies/` for more.
