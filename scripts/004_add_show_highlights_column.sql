-- Add missing show_highlights column to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS show_highlights boolean DEFAULT true;

-- Update existing properties to show highlights by default
UPDATE properties 
SET show_highlights = true 
WHERE show_highlights IS NULL;
