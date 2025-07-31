### Task: Implement Role-Based Access Control

**Description**: Configure Supabase RLS policies to enforce access based on user roles (visitor, registered, agent).

**PDR Reference**: Supabase RLS policies

**Dependencies**: Supabase schema setup

**Estimated Effort**: 6 hours

**Acceptance Criteria**:

- Visitors can read public properties and agents tables.
- Registered users can read/write to favorites and saved_searches.
- Agents can read/write to their own listings and inquiries.
- RLS policies prevent unauthorized access.

**Sample Code**:

```sql
-- RLS for registered users
CREATE POLICY registered_user_favorites ON favorites
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- RLS for agents
CREATE POLICY agent_listings ON listings
  FOR ALL TO authenticated
  USING (auth.uid() = (SELECT id FROM agents WHERE user_id = auth.uid()));
```
