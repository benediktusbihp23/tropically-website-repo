-- Complete CMS Overhaul Migration Script
-- This changes amenities from global to property-specific system

-- Step 1: Add slug column if it doesn't exist (already exists in schema)
-- Column already exists, no action needed

-- Step 2: Create property-specific categories table
CREATE TABLE IF NOT EXISTS property_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, name)
);

-- Step 3: Create property-specific amenities table  
CREATE TABLE IF NOT EXISTS property_amenities_custom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT REFERENCES properties(id) ON DELETE CASCADE,
  category_id UUID REFERENCES property_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Step 4: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_property_categories_property_id ON property_categories(property_id);
CREATE INDEX IF NOT EXISTS idx_property_amenities_custom_property_id ON property_amenities_custom(property_id);
CREATE INDEX IF NOT EXISTS idx_property_amenities_custom_category_id ON property_amenities_custom(category_id);

-- Step 5: Add comments for documentation
COMMENT ON TABLE property_categories IS 'Property-specific amenity categories - each property has its own categories';
COMMENT ON TABLE property_amenities_custom IS 'Property-specific amenities - completely independent per property';
