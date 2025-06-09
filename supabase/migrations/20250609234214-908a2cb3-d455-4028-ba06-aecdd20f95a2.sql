
-- Create a table to store extracted profile information from Gemini API
CREATE TABLE public.extracted_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  extracted_full_name TEXT,
  extracted_profession TEXT,
  extracted_city TEXT,
  extracted_experience_years INTEGER,
  extraction_confidence DECIMAL(3,2), -- 0.00 to 1.00
  gemini_response JSONB, -- Store the full Gemini response for reference
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.extracted_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for workers to view their own extracted profiles
CREATE POLICY "Workers can view their own extracted profiles" 
  ON public.extracted_profiles 
  FOR SELECT 
  USING (worker_id IN (SELECT id FROM workers WHERE user_id = auth.uid()));

-- Create policy for workers to insert their own extracted profiles
CREATE POLICY "Workers can create their own extracted profiles" 
  ON public.extracted_profiles 
  FOR INSERT 
  WITH CHECK (worker_id IN (SELECT id FROM workers WHERE user_id = auth.uid()));

-- Add index for better performance
CREATE INDEX idx_extracted_profiles_worker_id ON public.extracted_profiles(worker_id);
CREATE INDEX idx_extracted_profiles_created_at ON public.extracted_profiles(created_at);
