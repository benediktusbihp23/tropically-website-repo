-- Seed example properties
insert into public.properties (id, title, subtitle, location, description, guests, bedrooms, bathrooms, property_type, guesty_code, base_price, is_featured, is_published) values
  ('1', 'Luxury Ocean View Villa', 'Cliffside paradise with infinity pool', 'Uluwatu, Bali, Indonesia', 'Experience the ultimate Bali luxury in this breathtaking 4-bedroom villa perched on the cliffs of Uluwatu. This stunning property features floor-to-ceiling windows, an infinity pool overlooking the Indian Ocean, and modern Balinese design throughout.', 8, 4, 4, 'Villa', '68638df190b40f00127d1322', 850.00, true, true),
  ('2', 'Rice Field Retreat', 'Serene villa surrounded by nature', 'Ubud, Bali, Indonesia', 'Immerse yourself in Bali''s natural beauty at this serene 3-bedroom villa in Ubud. Surrounded by lush rice fields and tropical gardens, this tranquil retreat offers the perfect escape from everyday life.', 6, 3, 3, 'Villa', '68638df190b40f00127d1323', 450.00, true, true),
  ('3', 'Modern Beach House', 'Contemporary design meets coastal living', 'Canggu, Bali, Indonesia', 'This contemporary 2-bedroom beach house in Canggu combines modern design with coastal living. Just steps from the beach, this stylish property features an open-plan layout, private pool, and rooftop terrace.', 4, 2, 2, 'Beach House', '68638df190b40f00127d1324', 550.00, false, true),
  ('4', 'Traditional Balinese Estate', 'Authentic luxury in the heart of Seminyak', 'Seminyak, Bali, Indonesia', 'Experience authentic Balinese hospitality in this traditional 5-bedroom estate in Seminyak. Featuring carved teak wood, open-air pavilions, and a stunning tropical garden with pool, this property perfectly blends tradition with luxury.', 10, 5, 5, 'Estate', '68638df190b40f00127d1325', 950.00, true, true)
on conflict (id) do nothing;

-- Seed gallery images
insert into public.property_gallery_images (property_id, url, alt, sort_order) values
  ('1', '/luxury-bali-villa-infinity-pool-ocean-view.jpg', 'Infinity pool overlooking ocean', 1),
  ('1', '/modern-luxury-bedroom-bali.jpg', 'Master bedroom with ocean view', 2),
  ('1', '/luxury-kitchen-bali-villa.jpg', 'Modern kitchen', 3),
  ('1', '/luxury-bathroom-bali-villa.jpg', 'Spa bathroom', 4),
  ('1', '/bali-villa-outdoor-lounge.jpg', 'Outdoor lounge area', 5),
  
  ('2', '/ubud-rice-field-villa.jpg', 'Villa surrounded by rice fields', 1),
  ('2', '/modern-luxury-bedroom-bali.jpg', 'Peaceful bedroom', 2),
  ('2', '/luxury-kitchen-bali-villa.jpg', 'Kitchen with garden view', 3),
  
  ('3', '/canggu-beach-house.jpg', 'Modern beach house exterior', 1),
  ('3', '/modern-luxury-bedroom-bali.jpg', 'Stylish bedroom', 2),
  ('3', '/luxury-kitchen-bali-villa.jpg', 'Contemporary kitchen', 3),
  
  ('4', '/traditional-balinese-villa.jpg', 'Traditional Balinese architecture', 1),
  ('4', '/modern-luxury-bedroom-bali.jpg', 'Luxury bedroom', 2),
  ('4', '/luxury-kitchen-bali-villa.jpg', 'Kitchen area', 3)
on conflict do nothing;

-- Seed highlights
insert into public.property_highlights (property_id, icon, title, description, sort_order) values
  ('1', 'Waves', 'Ocean Views', 'Stunning panoramic views of the Indian Ocean from every room', 1),
  ('1', 'Wind', 'Designed for staying cool', 'Beat the heat with central AC and ceiling fans throughout', 2),
  ('1', 'Palmtree', 'Outdoor entertainment', 'The infinity pool and alfresco dining are perfect for gatherings', 3),
  
  ('2', 'Trees', 'Rice Field Views', 'Wake up to breathtaking views of emerald rice terraces', 1),
  ('2', 'Wind', 'Natural ventilation', 'Open-air design keeps you cool naturally', 2),
  
  ('3', 'Waves', 'Beach Access', 'Just 2 minutes walk to the famous Canggu beach', 1),
  ('3', 'Home', 'Modern Comfort', 'Contemporary design with all modern amenities', 2),
  
  ('4', 'Home', 'Authentic Design', 'Traditional Balinese architecture with luxury amenities', 1),
  ('4', 'Trees', 'Tropical Garden', 'Lush private garden with traditional water features', 2)
on conflict do nothing;

-- Seed amenities
insert into public.property_amenities (property_id, category, name, icon) values
  -- Property 1 amenities
  ('1', 'outdoor', 'Pool', 'Waves'),
  ('1', 'outdoor', 'Ocean View', 'Eye'),
  ('1', 'outdoor', 'Garden', 'Trees'),
  ('1', 'comfort', 'Air Conditioning', 'Wind'),
  ('1', 'entertainment', 'WiFi', 'Wifi'),
  ('1', 'entertainment', 'TV', 'Tv'),
  ('1', 'kitchen', 'Full Kitchen', 'UtensilsCrossed'),
  ('1', 'bathroom', 'Hot Water', 'Droplet'),
  ('1', 'safety', '24/7 Security', 'Shield'),
  ('1', 'parking', 'Free Parking', 'Car'),
  
  -- Property 2 amenities
  ('2', 'outdoor', 'Pool', 'Waves'),
  ('2', 'outdoor', 'Rice Field View', 'Mountain'),
  ('2', 'outdoor', 'Garden', 'Trees'),
  ('2', 'comfort', 'Air Conditioning', 'Wind'),
  ('2', 'entertainment', 'WiFi', 'Wifi'),
  ('2', 'kitchen', 'Full Kitchen', 'UtensilsCrossed'),
  ('2', 'bathroom', 'Hot Water', 'Droplet'),
  ('2', 'parking', 'Free Parking', 'Car'),
  
  -- Property 3 amenities
  ('3', 'outdoor', 'Beach Access', 'Palmtree'),
  ('3', 'outdoor', 'Pool', 'Waves'),
  ('3', 'comfort', 'Air Conditioning', 'Wind'),
  ('3', 'entertainment', 'WiFi', 'Wifi'),
  ('3', 'kitchen', 'Full Kitchen', 'UtensilsCrossed'),
  ('3', 'bathroom', 'Hot Water', 'Droplet'),
  ('3', 'parking', 'Free Parking', 'Car'),
  
  -- Property 4 amenities
  ('4', 'outdoor', 'Pool', 'Waves'),
  ('4', 'outdoor', 'Garden', 'Trees'),
  ('4', 'comfort', 'Air Conditioning', 'Wind'),
  ('4', 'entertainment', 'WiFi', 'Wifi'),
  ('4', 'entertainment', 'Sound System', 'Volume2'),
  ('4', 'kitchen', 'Full Kitchen', 'UtensilsCrossed'),
  ('4', 'bathroom', 'Hot Water', 'Droplet'),
  ('4', 'bathroom', 'Bathtub', 'Bath'),
  ('4', 'safety', '24/7 Security', 'Shield'),
  ('4', 'parking', 'Free Parking', 'Car')
on conflict do nothing;
