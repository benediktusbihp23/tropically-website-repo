-- Add slug, longitude, and latitude columns to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7),
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- Update existing properties with slugs based on title
UPDATE properties 
SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '''', ''), ',', ''))
WHERE slug IS NULL;
