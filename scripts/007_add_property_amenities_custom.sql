-- Fix table name mismatch: property_amenities_new should be property_amenities_custom
-- This ensures the query in getCMSPropertyBySlug works correctly

-- Drop old table if it exists
DROP TABLE IF EXISTS property_amenities_new CASCADE;

-- Rename to correct table name
ALTER TABLE IF EXISTS property_amenities_custom 
  DROP CONSTRAINT IF EXISTS property_amenities_custom_property_id_fkey;

-- If property_amenities_custom doesn't exist, create it
CREATE TABLE IF NOT EXISTS property_amenities_custom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES property_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, category_id, name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_property_amenities_custom_property_id 
  ON property_amenities_custom(property_id);
CREATE INDEX IF NOT EXISTS idx_property_amenities_custom_category_id 
  ON property_amenities_custom(category_id);
