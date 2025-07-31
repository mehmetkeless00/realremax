### Task: Set Up Supabase Project and Database Schema

**Description**: Initialize a Supabase project and define PostgreSQL schemas for users, properties, agents, and listings.

**PDR Reference**: Supabase PostgreSQL tables and RLS

**Dependencies**: None

**Estimated Effort**: 10 hours

**Acceptance Criteria**:

- Supabase project is created and connected.
- Tables created: users, properties, agents, listings.
- Schema includes necessary fields and relationships.
- Row-Level Security (RLS) policies are defined for protected access.

**Sample Code**:

```sql
-- Schema for properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  bedrooms INT,
  bathrooms INT,
  size INT,
  agent_id UUID REFERENCES agents(id),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY agent_access ON properties FOR ALL TO authenticated
  USING (auth.uid() = agent_id);
```
