
-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add latitude and longitude columns to workers table
ALTER TABLE workers 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create a spatial index for better performance on location queries
CREATE INDEX IF NOT EXISTS idx_workers_location 
ON workers USING GIST (ST_Point(longitude, latitude));

-- Create function to get nearby workers (fixed ROUND type casting)
CREATE OR REPLACE FUNCTION get_nearby_workers(
  user_lat DECIMAL(10, 8),
  user_lng DECIMAL(11, 8),
  radius_km INTEGER DEFAULT 10,
  profession_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  trade TEXT,
  city TEXT,
  bio TEXT,
  phone TEXT,
  profile_image_url TEXT,
  rating_avg NUMERIC,
  rating_count INTEGER,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  distance_km DECIMAL
) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    w.id,
    w.full_name,
    w.trade,
    w.city,
    w.bio,
    w.phone,
    w.profile_image_url,
    w.rating_avg,
    w.rating_count,
    w.latitude,
    w.longitude,
    ROUND(
      CAST(ST_Distance(
        geography(ST_MakePoint(user_lng, user_lat)),
        geography(ST_MakePoint(w.longitude, w.latitude))
      ) / 1000 AS NUMERIC), 2
    ) as distance_km
  FROM workers w
  WHERE w.is_approved = true
    AND w.latitude IS NOT NULL 
    AND w.longitude IS NOT NULL
    AND ST_DWithin(
      geography(ST_MakePoint(w.longitude, w.latitude)),
      geography(ST_MakePoint(user_lng, user_lat)),
      radius_km * 1000
    )
    AND (profession_filter IS NULL OR w.trade ILIKE '%' || profession_filter || '%')
  ORDER BY distance_km ASC
  LIMIT 50;
$$;
