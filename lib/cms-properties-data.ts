import type { CMSProperty } from "./types"
import { createClient } from "@/lib/supabase/server"

const FALLBACK_PROPERTIES: CMSProperty[] = [
  {
    id: "1",
    slug: "luxury-ocean-view-villa",
    guestyCode: "68638df190b40f00127d1322",
    featured: true,
    sortOrder: 0,
    title: "Luxury Ocean View Villa",
    subtitle: "Stunning 4-bedroom villa with infinity pool",
    description:
      "Experience the ultimate Bali luxury in this breathtaking 4-bedroom villa perched on the cliffs of Uluwatu. Wake up to panoramic ocean views, take a dip in the infinity pool, and enjoy world-class amenities designed for the discerning traveler.",
    propertyType: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    guests: 8,
    longitude: 115.0881,
    latitude: -8.4095,
    showHighlights: true,
    highlights: [
      {
        id: "1",
        icon: "waves",
        title: "Ocean paradise",
        description: "Breathtaking infinity pool with direct ocean views perfect for sunset moments.",
      },
      {
        id: "2",
        icon: "wind",
        title: "Climate comfort",
        description: "Stay cool with premium AC throughout and designer ceiling fans.",
      },
    ],
    images: [
      {
        id: "1",
        url: "/luxury-bali-villa-infinity-pool-ocean-view.jpg",
        category: "general",
        isMainGallery: true,
        sortOrder: 0,
      },
      {
        id: "2",
        url: "/modern-luxury-bedroom-bali.jpg",
        category: "general",
        isMainGallery: true,
        sortOrder: 1,
      },
      {
        id: "3",
        url: "/luxury-kitchen-bali-villa.jpg",
        category: "general",
        isMainGallery: true,
        sortOrder: 2,
      },
    ],
    amenities: ["pool", "wifi", "air-conditioning", "kitchen", "parking", "ocean-view"],
    location: "Uluwatu, Bali, Indonesia",
    address: "Uluwatu, Bali, Indonesia",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "rice-field-retreat",
    guestyCode: "68638df190b40f00127d1323",
    featured: true,
    sortOrder: 1,
    title: "Rice Field Retreat",
    subtitle: "Peaceful 3-bedroom villa surrounded by nature",
    description:
      "Immerse yourself in Bali's natural beauty at this serene 3-bedroom villa in Ubud. Surrounded by lush rice terraces and tropical gardens, this retreat offers the perfect blend of luxury and tranquility.",
    propertyType: "Villa",
    bedrooms: 3,
    bathrooms: 3,
    guests: 6,
    longitude: 115.2624,
    latitude: -8.5069,
    showHighlights: true,
    highlights: [
      {
        id: "3",
        icon: "tree",
        title: "Nature immersion",
        description: "Surrounded by emerald rice fields and tropical gardens for ultimate serenity.",
      },
      {
        id: "4",
        icon: "utensils",
        title: "Gourmet kitchen",
        description: "Fully equipped modern kitchen with premium appliances and cookware.",
      },
    ],
    images: [
      {
        id: "4",
        url: "/bali-rice-field-villa.jpg",
        category: "general",
        isMainGallery: true,
        sortOrder: 0,
      },
      {
        id: "5",
        url: "/tropical-villa-bedroom.jpg",
        category: "general",
        isMainGallery: true,
        sortOrder: 1,
      },
    ],
    amenities: ["pool", "wifi", "air-conditioning", "kitchen", "garden", "rice-field-view"],
    location: "Ubud, Bali, Indonesia",
    address: "Ubud, Bali, Indonesia",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "modern-beach-house",
    guestyCode: "68638df190b40f00127d1324",
    featured: false,
    sortOrder: 2,
    title: "Modern Beach House",
    subtitle: "Contemporary 2-bedroom beachfront property",
    description:
      "This contemporary 2-bedroom beach house in Canggu combines modern design with coastal living. Steps from the beach, featuring sleek interiors and premium amenities for the modern traveler.",
    propertyType: "Beach House",
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    longitude: 115.1381,
    latitude: -8.6481,
    showHighlights: true,
    highlights: [
      {
        id: "5",
        icon: "waves",
        title: "Beachfront bliss",
        description: "Just steps to the sand with private beach access for morning surf sessions.",
      },
      {
        id: "6",
        icon: "home",
        title: "Designer interiors",
        description: "Curated modern design with luxury furnishings and artistic touches.",
      },
    ],
    images: [
      {
        id: "6",
        url: "/modern-beach-house-bali.jpg",
        category: "general",
        isMainGallery: true,
        sortOrder: 0,
      },
    ],
    amenities: ["wifi", "air-conditioning", "kitchen", "beach-access"],
    location: "Canggu, Bali, Indonesia",
    address: "Canggu, Bali, Indonesia",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    slug: "tropical-garden-estate",
    guestyCode: "68638df190b40f00127d1325",
    featured: false,
    sortOrder: 3,
    title: "Tropical Garden Estate",
    subtitle: "Spacious 5-bedroom compound with multiple pools",
    description:
      "An expansive 5-bedroom estate in Seminyak featuring multiple living pavilions, two swimming pools, and extensive tropical gardens. Perfect for large groups and special celebrations.",
    propertyType: "Estate",
    bedrooms: 5,
    bathrooms: 5,
    guests: 10,
    longitude: 115.1667,
    latitude: -8.6928,
    showHighlights: true,
    highlights: [
      {
        id: "7",
        icon: "users",
        title: "Group paradise",
        description: "Multiple pavilions and pools perfect for families and group celebrations.",
      },
      {
        id: "8",
        icon: "home",
        title: "Event ready",
        description: "Spacious grounds and facilities ideal for weddings and special occasions.",
      },
    ],
    images: [
      {
        id: "7",
        url: "/tropical-estate-bali.jpg",
        category: "general",
        isMainGallery: true,
        sortOrder: 0,
      },
    ],
    amenities: ["pool", "wifi", "air-conditioning", "kitchen", "parking", "garden"],
    location: "Seminyak, Bali, Indonesia",
    address: "Seminyak, Bali, Indonesia",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function getCMSProperties(): Promise<CMSProperty[]> {
  try {
    const supabase = await createClient()

    const { data: properties, error } = await supabase
      .from("properties")
      .select(`
        *,
        gallery_images:property_gallery_images(*),
        categorized_images:property_categorized_images(*),
        highlights:property_highlights(*),
        amenities:property_amenities(*)
      `)
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.log("[v0] Supabase error, using fallback data:", error.message)
      return FALLBACK_PROPERTIES
    }

    if (!properties || properties.length === 0) {
      console.log("[v0] No properties in database, using fallback data")
      return FALLBACK_PROPERTIES
    }

    return await Promise.all(properties.map(mapDatabasePropertyToCMS))
  } catch (error) {
    console.log("[v0] Error fetching from Supabase, using fallback data")
    return FALLBACK_PROPERTIES
  }
}

export async function getCMSProperty(id: string): Promise<CMSProperty | null> {
  const supabase = await createClient()

  const { data: property, error } = await supabase
    .from("properties")
    .select(`
      *,
      gallery_images:property_gallery_images(*),
      categorized_images:property_categorized_images(*),
      highlights:property_highlights(*),
      amenities:property_amenities(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("[v0] Error fetching property:", error)
    return null
  }

  return await mapDatabasePropertyToCMS(property)
}

export async function getCMSPropertyById(id: string): Promise<CMSProperty | null> {
  return getCMSProperty(id)
}

export async function getAllCMSProperties(): Promise<CMSProperty[]> {
  const supabase = await createClient()

  const { data: properties, error } = await supabase
    .from("properties")
    .select(`
      *,
      gallery_images:property_gallery_images(*),
      categorized_images:property_categorized_images(*),
      highlights:property_highlights(*),
      amenities:property_amenities(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching all properties:", error)
    return []
  }

  return await Promise.all(properties.map(mapDatabasePropertyToCMS))
}

export async function updateCMSProperty(id: string, updates: Partial<CMSProperty>): Promise<void> {
  console.log("[v0] Updating property:", id, updates)

  try {
    const supabase = await createClient()

    const propertyUpdates: any = {}
    if (updates.title !== undefined) propertyUpdates.title = updates.title
    if (updates.slug !== undefined) propertyUpdates.slug = updates.slug
    if (updates.subtitle !== undefined) propertyUpdates.subtitle = updates.subtitle
    if (updates.description !== undefined) propertyUpdates.description = updates.description
    if (updates.location !== undefined) propertyUpdates.location = updates.location
    if (updates.longitude !== undefined) propertyUpdates.longitude = updates.longitude
    if (updates.latitude !== undefined) propertyUpdates.latitude = updates.latitude
    if (updates.propertyType !== undefined) propertyUpdates.property_type = updates.propertyType
    if (updates.bedrooms !== undefined) propertyUpdates.bedrooms = updates.bedrooms
    if (updates.bathrooms !== undefined) propertyUpdates.bathrooms = updates.bathrooms
    if (updates.guests !== undefined) propertyUpdates.guests = updates.guests
    if (updates.guestyCode !== undefined) propertyUpdates.guesty_code = updates.guestyCode
    if (updates.featured !== undefined) propertyUpdates.is_featured = updates.featured
    if (updates.active !== undefined) propertyUpdates.is_published = updates.active

    propertyUpdates.updated_at = new Date().toISOString()

    console.log("[v0] Updating with data:", propertyUpdates)

    const { error: propertyError } = await supabase.from("properties").update(propertyUpdates).eq("id", id)

    if (propertyError) {
      console.error("[v0] Supabase error updating property:", propertyError)
      throw propertyError
    }

    console.log("[v0] Property base data updated successfully")

    // Update related data if provided
    if (updates.images) {
      console.log("[v0] Updating images...")
      await supabase.from("property_gallery_images").delete().eq("property_id", id)
      await supabase.from("property_categorized_images").delete().eq("property_id", id)

      const galleryImages = updates.images
        .filter((img) => img.isMainGallery)
        .map((img) => ({
          property_id: id,
          url: img.url,
          alt: img.url,
          sort_order: img.sortOrder,
        }))

      const categorizedImages = updates.images
        .filter((img) => !img.isMainGallery && img.category !== "general")
        .map((img) => ({
          property_id: id,
          category: img.category,
          url: img.url,
          alt: img.url,
          sort_order: img.sortOrder,
        }))

      if (galleryImages.length > 0) {
        await supabase.from("property_gallery_images").insert(galleryImages)
      }

      if (categorizedImages.length > 0) {
        await supabase.from("property_categorized_images").insert(categorizedImages)
      }
      console.log("[v0] Images updated successfully")
    }

    if (updates.highlights) {
      console.log("[v0] Updating highlights...")
      await supabase.from("property_highlights").delete().eq("property_id", id)

      const highlights = updates.highlights.map((h, idx) => ({
        property_id: id,
        icon: h.icon || "",
        title: h.title,
        description: h.description,
        sort_order: idx,
      }))

      if (highlights.length > 0) {
        await supabase.from("property_highlights").insert(highlights)
      }
      console.log("[v0] Highlights updated successfully")
    }

    if (updates.amenities) {
      console.log("[v0] Updating amenities...")
      await supabase.from("property_amenities").delete().eq("property_id", id)

      const { data: amenityItems, error: fetchError } = await supabase
        .from("amenity_items")
        .select("id, name, icon, category_id")
        .in("id", updates.amenities)

      if (fetchError) {
        console.error("[v0] Error fetching amenity items:", fetchError)
        throw fetchError
      }

      if (amenityItems && amenityItems.length > 0) {
        const amenities = amenityItems.map((item) => ({
          property_id: id,
          category: item.category_id,
          name: item.name,
          icon: item.icon,
        }))

        const { error: amenitiesError } = await supabase.from("property_amenities").insert(amenities)

        if (amenitiesError) {
          console.error("[v0] Error saving amenities:", amenitiesError)
          throw amenitiesError
        } else {
          console.log("[v0] Amenities saved successfully:", amenities.length, "items")
        }
      }
    }

    console.log("[v0] Property updated successfully in database")
  } catch (error: any) {
    console.error("[v0] Error in updateCMSProperty:", error.message)
    throw error
  }
}

export async function createCMSProperty(
  property: Omit<CMSProperty, "id" | "createdAt" | "updatedAt">,
): Promise<CMSProperty> {
  const supabase = await createClient()

  const id = Date.now().toString()

  const { error } = await supabase.from("properties").insert({
    id,
    title: property.title,
    subtitle: property.subtitle,
    location: property.location,
    description: property.description,
    guests: property.guests,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    property_type: property.propertyType,
    guesty_code: property.guestyCode,
    is_featured: property.featured,
    is_published: property.active,
    slug: property.slug,
    longitude: property.longitude,
    latitude: property.latitude,
  })

  if (error) {
    console.error("[v0] Error creating property:", error)
    throw error
  }

  // Insert images
  if (property.images && property.images.length > 0) {
    const galleryImages = property.images
      .filter((img) => img.isMainGallery)
      .map((img) => ({
        property_id: id,
        url: img.url,
        alt: img.url,
        sort_order: img.sortOrder,
      }))

    if (galleryImages.length > 0) {
      await supabase.from("property_gallery_images").insert(galleryImages)
    }
  }

  // Insert highlights
  if (property.highlights && property.highlights.length > 0) {
    const highlights = property.highlights.map((h, idx) => ({
      property_id: id,
      icon: h.icon || "",
      title: h.title,
      description: h.description,
      sort_order: idx,
    }))

    await supabase.from("property_highlights").insert(highlights)
  }

  // Insert amenities
  if (property.amenities && property.amenities.length > 0) {
    const { data: amenityItems } = await supabase
      .from("amenity_items")
      .select("id, name, icon, category_id")
      .in("id", property.amenities)

    if (amenityItems) {
      const amenities = amenityItems.map((item) => ({
        property_id: id,
        category: item.category_id,
        name: item.name,
        icon: item.icon,
      }))

      await supabase.from("property_amenities").insert(amenities)
    }
  }

  return {
    ...property,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export async function deleteCMSProperty(id: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("properties").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting property:", error)
    throw error
  }
}

// Helper function to map database structure to CMS structure
async function mapDatabasePropertyToCMS(dbProperty: any): Promise<CMSProperty> {
  const galleryImages = (dbProperty.gallery_images || []).map((img: any, idx: number) => ({
    id: img.id,
    url: img.url,
    category: "general",
    isMainGallery: true,
    sortOrder: img.sort_order || idx,
  }))

  const categorizedImages = (dbProperty.categorized_images || []).map((img: any, idx: number) => ({
    id: img.id,
    url: img.url,
    category: img.category,
    isMainGallery: false,
    sortOrder: img.sort_order || idx,
  }))

  const highlights = (dbProperty.highlights || []).map((h: any) => ({
    id: h.id,
    icon: h.icon || "",
    title: h.title,
    description: h.description,
  }))

  let amenities: string[] = []
  if (dbProperty.amenities && dbProperty.amenities.length > 0) {
    const supabase = await createClient()
    const amenityNames = dbProperty.amenities.map((a: any) => a.name)

    console.log("[v0] Property", dbProperty.id, "saved amenity names:", amenityNames)

    const { data: amenityItems, error } = await supabase
      .from("amenity_items")
      .select("id, name")
      .in("name", amenityNames)

    if (!error && amenityItems) {
      amenities = amenityItems.map((item) => item.id)
      console.log("[v0] Property", dbProperty.id, "mapped to amenity IDs:", amenities)
    } else {
      console.error("[v0] Error fetching amenity IDs for property", dbProperty.id, ":", error)
    }
  }

  return {
    id: dbProperty.id,
    slug: dbProperty.slug || "",
    guestyCode: dbProperty.guesty_code,
    featured: dbProperty.is_featured,
    sortOrder: 0,
    title: dbProperty.title,
    subtitle: dbProperty.subtitle,
    description: dbProperty.description,
    propertyType: dbProperty.property_type,
    bedrooms: dbProperty.bedrooms,
    bathrooms: dbProperty.bathrooms,
    guests: dbProperty.guests,
    longitude: dbProperty.longitude,
    latitude: dbProperty.latitude,
    showHighlights: highlights.length > 0,
    highlights,
    images: [...galleryImages, ...categorizedImages],
    amenities,
    location: dbProperty.location,
    address: dbProperty.location,
    active: dbProperty.is_published,
    createdAt: dbProperty.created_at,
    updatedAt: dbProperty.updated_at,
  }
}

// Get amenity categories and items
export async function getAmenityCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("amenity_categories")
    .select("*, items:amenity_items(*)")
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching amenity categories:", error)
    return []
  }

  return data
}

export async function addAmenityCategory(name: string): Promise<void> {
  const supabase = await createClient()

  const id = name.toLowerCase().replace(/\s+/g, "-")

  const { error } = await supabase.from("amenity_categories").insert({ id, name })

  if (error) {
    console.error("[v0] Error adding amenity category:", error)
    throw error
  }
}

export async function addAmenityItem(categoryId: string, name: string, icon: string): Promise<void> {
  const supabase = await createClient()

  const id = name.toLowerCase().replace(/\s+/g, "-")

  const { error } = await supabase.from("amenity_items").insert({ id, category_id: categoryId, name, icon })

  if (error) {
    console.error("[v0] Error adding amenity item:", error)
    throw error
  }
}
