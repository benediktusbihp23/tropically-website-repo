-- Create properties table
create table if not exists public.properties (
  id text primary key,
  title text not null,
  subtitle text,
  location text not null,
  description text not null,
  guests integer not null,
  bedrooms integer not null,
  bathrooms integer not null,
  property_type text not null,
  guesty_code text not null,
  base_price numeric(10, 2),
  is_featured boolean default false,
  is_published boolean default true,
  show_highlights boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create gallery images table
create table if not exists public.property_gallery_images (
  id uuid primary key default gen_random_uuid(),
  property_id text references public.properties(id) on delete cascade,
  url text not null,
  alt text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Create categorized images table
create table if not exists public.property_categorized_images (
  id uuid primary key default gen_random_uuid(),
  property_id text references public.properties(id) on delete cascade,
  category text not null,
  url text not null,
  alt text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Create highlights table
create table if not exists public.property_highlights (
  id uuid primary key default gen_random_uuid(),
  property_id text references public.properties(id) on delete cascade,
  icon text not null,
  title text not null,
  description text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Create amenities table
create table if not exists public.property_amenities (
  id uuid primary key default gen_random_uuid(),
  property_id text references public.properties(id) on delete cascade,
  category text not null,
  name text not null,
  icon text not null,
  created_at timestamptz default now()
);

-- Create amenity categories table for admin to manage
create table if not exists public.amenity_categories (
  id text primary key,
  name text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Create amenity items table for admin to manage
create table if not exists public.amenity_items (
  id text primary key,
  category_id text references public.amenity_categories(id) on delete cascade,
  name text not null,
  icon text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Disable RLS for CMS tables (admin access only - no user auth needed for CMS)
alter table public.properties disable row level security;
alter table public.property_gallery_images disable row level security;
alter table public.property_categorized_images disable row level security;
alter table public.property_highlights disable row level security;
alter table public.property_amenities disable row level security;
alter table public.amenity_categories disable row level security;
alter table public.amenity_items disable row level security;

-- Create indexes for better query performance
create index if not exists idx_properties_is_published on public.properties(is_published);
create index if not exists idx_properties_is_featured on public.properties(is_featured);
create index if not exists idx_gallery_images_property_id on public.property_gallery_images(property_id);
create index if not exists idx_categorized_images_property_id on public.property_categorized_images(property_id);
create index if not exists idx_highlights_property_id on public.property_highlights(property_id);
create index if not exists idx_amenities_property_id on public.property_amenities(property_id);
create index if not exists idx_amenity_items_category_id on public.amenity_items(category_id);
