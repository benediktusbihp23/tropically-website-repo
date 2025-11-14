-- Property-specific image categories
CREATE TABLE IF NOT EXISTS image_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, name)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_image_categories_property_id ON image_categories(property_id);

-- Property images
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  category_id UUID REFERENCES image_categories(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  file_size INTEGER,
  original_filename TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_category_id ON property_images(category_id);
CREATE INDEX IF NOT EXISTS idx_property_images_featured ON property_images(is_featured) WHERE is_featured = true;

-- Ensure only ONE featured image per property
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_featured_per_property 
ON property_images(property_id) 
WHERE is_featured = true;
