-- Advanced Row Level Security Policies
-- Bu dosya mevcut RLS politikalarını geliştirir ve ek güvenlik katmanları ekler

-- =====================================================
-- ENHANCED USERS TABLE POLICIES
-- =====================================================

-- Drop existing policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Allow public read access to users" ON users;

-- Enhanced users policies
CREATE POLICY "users_select_own_profile" ON users
  FOR SELECT 
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "users_update_own_profile" ON users
  FOR UPDATE 
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "users_insert_own_profile" ON users
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "users_public_read" ON users
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- =====================================================
-- ENHANCED AGENTS TABLE POLICIES
-- =====================================================

-- Drop existing policies for agents table
DROP POLICY IF EXISTS "Agents can view their own profile" ON agents;
DROP POLICY IF EXISTS "Agents can update their own profile" ON agents;
DROP POLICY IF EXISTS "Allow public read access to agents" ON agents;
DROP POLICY IF EXISTS "Agents can insert their own profile" ON agents;

-- Enhanced agents policies
CREATE POLICY "agents_select_own_profile" ON agents
  FOR SELECT 
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "agents_update_own_profile" ON agents
  FOR UPDATE 
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "agents_insert_own_profile" ON agents
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "agents_public_read" ON agents
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- =====================================================
-- ENHANCED PROPERTIES TABLE POLICIES
-- =====================================================

-- Drop existing policies for properties table
DROP POLICY IF EXISTS "Allow public read access to properties" ON properties;
DROP POLICY IF EXISTS "Agents can insert properties" ON properties;
DROP POLICY IF EXISTS "Agents can update their own properties" ON properties;
DROP POLICY IF EXISTS "Agents can delete their own properties" ON properties;

-- Enhanced properties policies
CREATE POLICY "properties_public_read" ON properties
  FOR SELECT 
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "properties_agent_read_all" ON properties
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "properties_agent_insert" ON properties
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = properties.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "properties_agent_update" ON properties
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = properties.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = properties.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "properties_agent_delete" ON properties
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = properties.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  );

-- =====================================================
-- ENHANCED LISTINGS TABLE POLICIES
-- =====================================================

-- Drop existing policies for listings table
DROP POLICY IF EXISTS "Allow public read access to listings" ON listings;
DROP POLICY IF EXISTS "Agents can insert listings" ON listings;
DROP POLICY IF EXISTS "Agents can update their own listings" ON listings;
DROP POLICY IF EXISTS "Agents can delete their own listings" ON listings;

-- Enhanced listings policies
CREATE POLICY "listings_public_read" ON listings
  FOR SELECT 
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "listings_agent_read_all" ON listings
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "listings_agent_insert" ON listings
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = listings.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "listings_agent_update" ON listings
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = listings.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = listings.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "listings_agent_delete" ON listings
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = listings.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  );

-- =====================================================
-- ENHANCED FAVORITES TABLE POLICIES
-- =====================================================

-- Drop existing policies for favorites table
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;

-- Enhanced favorites policies
CREATE POLICY "favorites_user_select" ON favorites
  FOR SELECT 
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "favorites_user_insert" ON favorites
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "favorites_user_delete" ON favorites
  FOR DELETE 
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- =====================================================
-- ENHANCED INQUIRIES TABLE POLICIES
-- =====================================================

-- Drop existing policies for inquiries table
DROP POLICY IF EXISTS "Users can view their own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Users can insert their own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Agents can view inquiries for their properties" ON inquiries;
DROP POLICY IF EXISTS "Agents can update inquiries for their properties" ON inquiries;

-- Enhanced inquiries policies
CREATE POLICY "inquiries_user_select" ON inquiries
  FOR SELECT 
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "inquiries_user_insert" ON inquiries
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "inquiries_agent_select" ON inquiries
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = inquiries.property_id 
      AND properties.agent_id IN (
        SELECT id FROM agents WHERE user_id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "inquiries_agent_update" ON inquiries
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = inquiries.property_id 
      AND properties.agent_id IN (
        SELECT id FROM agents WHERE user_id::text = auth.uid()::text
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = inquiries.property_id 
      AND properties.agent_id IN (
        SELECT id FROM agents WHERE user_id::text = auth.uid()::text
      )
    )
  );

-- =====================================================
-- ADDITIONAL SECURITY FEATURES
-- =====================================================

-- Create function to check if user is agent
CREATE OR REPLACE FUNCTION is_agent(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM agents 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user owns property
CREATE OR REPLACE FUNCTION owns_property(user_uuid UUID, property_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM properties p
    JOIN agents a ON p.agent_id = a.id
    WHERE a.user_id = user_uuid AND p.id = property_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user owns inquiry
CREATE OR REPLACE FUNCTION owns_inquiry(user_uuid UUID, inquiry_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM inquiries 
    WHERE user_id = user_uuid AND id = inquiry_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if agent can access inquiry
CREATE OR REPLACE FUNCTION agent_can_access_inquiry(user_uuid UUID, inquiry_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM inquiries i
    JOIN properties p ON i.property_id = p.id
    JOIN agents a ON p.agent_id = a.id
    WHERE a.user_id = user_uuid AND i.id = inquiry_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- AUDIT LOGGING
-- =====================================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  record_id UUID,
  user_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "audit_logs_admin_read" ON audit_logs
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, operation, record_id, user_id, new_data)
    VALUES (TG_TABLE_NAME, 'INSERT', NEW.id, auth.uid(), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, operation, record_id, user_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, 'UPDATE', NEW.id, auth.uid(), to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, operation, record_id, user_id, old_data)
    VALUES (TG_TABLE_NAME, 'DELETE', OLD.id, auth.uid(), to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for sensitive tables
CREATE TRIGGER audit_properties_trigger
  AFTER INSERT OR UPDATE OR DELETE ON properties
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_inquiries_trigger
  AFTER INSERT OR UPDATE OR DELETE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_favorites_trigger
  AFTER INSERT OR UPDATE OR DELETE ON favorites
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function(); 