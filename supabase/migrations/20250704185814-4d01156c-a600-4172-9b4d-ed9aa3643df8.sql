
-- Enable PostGIS extension for geographic queries (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create custom types that don't exist yet
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'done', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE announcement_audience AS ENUM ('all', 'worker', 'client');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create workers_profile table (extending existing workers table functionality)
CREATE TABLE IF NOT EXISTS public.workers_profile (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  profession TEXT NOT NULL,
  bio TEXT,
  portfolio_url TEXT,
  rating DOUBLE PRECISION DEFAULT 0.0,
  approved BOOLEAN DEFAULT false,
  flagged_count INTEGER DEFAULT 0,
  experience_years INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients_profile table
CREATE TABLE IF NOT EXISTS public.clients_profile (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  job_count INTEGER DEFAULT 0,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  audience announcement_audience DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.admins(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  data_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on new tables
ALTER TABLE public.workers_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workers_profile
CREATE POLICY "Workers can view and update their own profile" ON public.workers_profile
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view approved worker profiles" ON public.workers_profile
  FOR SELECT USING (approved = true);

-- RLS Policies for clients_profile
CREATE POLICY "Clients can view and update their own profile" ON public.clients_profile
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for reports
CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for announcements
CREATE POLICY "Users can view announcements" ON public.announcements
  FOR SELECT USING (true);

-- RLS Policies for admins (service role access only)
CREATE POLICY "Service role access only admins" ON public.admins
  FOR ALL USING (false);

CREATE POLICY "Service role access only audit" ON public.audit_logs
  FOR ALL USING (false);

-- Functions and triggers for automatic calculations
CREATE OR REPLACE FUNCTION update_worker_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.workers_profile 
  SET rating = (
    SELECT AVG(rating)::DOUBLE PRECISION 
    FROM public.reviews 
    WHERE worker_id = NEW.worker_id AND NOT is_verified = false
  )
  WHERE user_id = NEW.worker_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_worker_rating_trigger ON public.reviews;
CREATE TRIGGER update_worker_rating_trigger
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_worker_rating();

-- Function to increment flagged count
CREATE OR REPLACE FUNCTION increment_flagged_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.workers_profile 
  SET flagged_count = flagged_count + 1
  WHERE user_id = NEW.reported_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_flagged_count_trigger
  AFTER INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION increment_flagged_count();

-- Function to update client job count
CREATE OR REPLACE FUNCTION update_client_job_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.clients_profile 
    SET job_count = job_count + 1
    WHERE user_id = NEW.client_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_client_job_count_trigger ON public.bookings;
CREATE TRIGGER update_client_job_count_trigger
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_client_job_count();

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_workers_approved ON public.workers_profile(approved);
CREATE INDEX IF NOT EXISTS idx_workers_profession ON public.workers_profile(profession);
CREATE INDEX IF NOT EXISTS idx_reports_reported_id ON public.reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_announcements_audience ON public.announcements(audience);

-- Add new columns to existing users table if they don't exist
DO $$ BEGIN
    ALTER TABLE public.users ADD COLUMN latitude DOUBLE PRECISION;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.users ADD COLUMN longitude DOUBLE PRECISION;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create location index for users if coordinates exist
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users USING GIST(geography(ST_MakePoint(longitude, latitude))) WHERE longitude IS NOT NULL AND latitude IS NOT NULL;

-- Create storage buckets (using INSERT ... ON CONFLICT to avoid duplicates)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolios', 'portfolios', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for portfolios bucket
DROP POLICY IF EXISTS "Portfolio files are publicly accessible" ON storage.objects;
CREATE POLICY "Portfolio files are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolios');

DROP POLICY IF EXISTS "Workers can upload their portfolio files" ON storage.objects;
CREATE POLICY "Workers can upload their portfolio files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Workers can update their portfolio files" ON storage.objects;
CREATE POLICY "Workers can update their portfolio files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);
