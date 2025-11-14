-- Seed default amenity categories
insert into public.amenity_categories (id, name, sort_order) values
  ('outdoor', 'Outdoor', 1),
  ('comfort', 'Comfort & Cooling', 2),
  ('entertainment', 'Entertainment', 3),
  ('kitchen', 'Kitchen & Dining', 4),
  ('bathroom', 'Bathroom', 5),
  ('safety', 'Safety & Security', 6),
  ('workspace', 'Workspace', 7),
  ('parking', 'Parking & Transport', 8)
on conflict (id) do nothing;

-- Seed default amenity items
insert into public.amenity_items (id, category_id, name, icon, sort_order) values
  -- Outdoor
  ('pool', 'outdoor', 'Pool', 'Waves', 1),
  ('garden', 'outdoor', 'Garden', 'Trees', 2),
  ('beach-access', 'outdoor', 'Beach Access', 'Palmtree', 3),
  ('ocean-view', 'outdoor', 'Ocean View', 'Eye', 4),
  ('rice-field-view', 'outdoor', 'Rice Field View', 'Mountain', 5),
  
  -- Comfort
  ('air-conditioning', 'comfort', 'Air Conditioning', 'Wind', 1),
  ('ceiling-fan', 'comfort', 'Ceiling Fan', 'Fan', 2),
  ('heating', 'comfort', 'Heating', 'Flame', 3),
  
  -- Entertainment
  ('wifi', 'entertainment', 'WiFi', 'Wifi', 1),
  ('tv', 'entertainment', 'TV', 'Tv', 2),
  ('sound-system', 'entertainment', 'Sound System', 'Volume2', 3),
  
  -- Kitchen
  ('kitchen', 'kitchen', 'Full Kitchen', 'UtensilsCrossed', 1),
  ('refrigerator', 'kitchen', 'Refrigerator', 'Refrigerator', 2),
  ('coffee-maker', 'kitchen', 'Coffee Maker', 'Coffee', 3),
  ('dining-area', 'kitchen', 'Dining Area', 'UtensilsCrossed', 4),
  
  -- Bathroom
  ('hot-water', 'bathroom', 'Hot Water', 'Droplet', 1),
  ('bathtub', 'bathroom', 'Bathtub', 'Bath', 2),
  ('towels', 'bathroom', 'Towels Provided', 'Wind', 3),
  
  -- Safety
  ('first-aid', 'safety', 'First Aid Kit', 'Cross', 1),
  ('fire-extinguisher', 'safety', 'Fire Extinguisher', 'Flame', 2),
  ('security', 'safety', '24/7 Security', 'Shield', 3),
  ('safe', 'safety', 'Safe', 'Lock', 4),
  
  -- Workspace
  ('desk', 'workspace', 'Desk', 'Laptop', 1),
  ('office-chair', 'workspace', 'Office Chair', 'ArmChair', 2),
  
  -- Parking
  ('parking', 'parking', 'Free Parking', 'Car', 1),
  ('ev-charger', 'parking', 'EV Charger', 'Zap', 2)
on conflict (id) do nothing;
