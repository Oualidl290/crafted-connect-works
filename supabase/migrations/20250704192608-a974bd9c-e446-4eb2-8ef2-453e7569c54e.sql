-- Create the user_role enum type
CREATE TYPE user_role AS ENUM ('client', 'worker', 'admin');

-- Update the users table to ensure all columns exist and have proper types
ALTER TABLE users 
  ALTER COLUMN role SET DEFAULT 'client'::user_role;

-- Ensure workers_profile table has the correct structure  
-- (This table seems to already exist based on the schema, but let's make sure it's properly set up)
DO $$ 
BEGIN
  -- Check if workers_profile table exists, if not create it
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workers_profile') THEN
    CREATE TABLE workers_profile (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      profession TEXT NOT NULL DEFAULT 'حرفي',
      bio TEXT,
      experience_years INTEGER DEFAULT 0,
      rating DOUBLE PRECISION DEFAULT 0.0,
      approved BOOLEAN DEFAULT false,
      flagged_count INTEGER DEFAULT 0,
      portfolio_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS on workers_profile if not already enabled
ALTER TABLE workers_profile ENABLE ROW LEVEL SECURITY;

-- Create or update RLS policies for workers_profile
DROP POLICY IF EXISTS "Workers can view and update their own profile" ON workers_profile;
CREATE POLICY "Workers can view and update their own profile"
  ON workers_profile
  FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view approved worker profiles" ON workers_profile;  
CREATE POLICY "Anyone can view approved worker profiles"
  ON workers_profile
  FOR SELECT
  USING (approved = true);