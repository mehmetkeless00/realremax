-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'visitor' CHECK (role IN ('visitor', 'registered', 'agent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'registered')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user record when auth.users gets a new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  company VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  bedrooms INT,
  bathrooms DECIMAL(3,1),
  size INT,
  year_built INT,
  agent_id UUID REFERENCES agents(id),
  status VARCHAR(20) DEFAULT 'active',
  listing_type VARCHAR(10) DEFAULT 'sale' CHECK (listing_type IN ('sale', 'rent')),
  amenities TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Turkey',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  listing_type VARCHAR(10) NOT NULL CHECK (listing_type IN ('sale', 'rent')),
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'rented')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, property_id)
);

-- Create inquiries table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_properties_agent_id ON properties(agent_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_listings_property_id ON listings(property_id);
CREATE INDEX idx_listings_agent_id ON listings(agent_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_property_id ON favorites(property_id);
CREATE INDEX idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX idx_inquiries_agent_id ON inquiries(agent_id);
CREATE INDEX idx_inquiries_user_id ON inquiries(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Allow public read access to users" ON users
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Agents can view their own profile" ON agents
  FOR SELECT TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Agents can update their own profile" ON agents
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Allow public read access to agents" ON agents
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Agents can insert their own profile" ON agents
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Allow public read access to properties" ON properties
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Agents can insert properties" ON properties
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = properties.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Agents can update their own properties" ON properties
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = properties.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Agents can delete their own properties" ON properties
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = properties.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Allow public read access to listings" ON listings
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Agents can manage their own listings" ON listings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = listings.agent_id 
      AND agents.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage their own favorites" ON favorites
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Allow public read access to favorites" ON favorites
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Users can manage their own inquiries" ON inquiries
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Agents can view inquiries for their properties" ON inquiries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = inquiries.property_id 
      AND properties.agent_id IN (
        SELECT id FROM agents WHERE agents.user_id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Allow public insert access to inquiries" ON inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 