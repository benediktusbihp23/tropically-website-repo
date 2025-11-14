import type { Amenity, AmenityCategory } from "./types"

export const amenityCategories: AmenityCategory[] = [
  { id: "essentials", name: "Essentials", sortOrder: 1 },
  { id: "features", name: "Features", sortOrder: 2 },
  { id: "safety", name: "Safety", sortOrder: 3 },
  { id: "outdoor", name: "Outdoor", sortOrder: 4 },
]

export let PREDEFINED_AMENITIES: Amenity[] = [
  // Essentials
  { id: "wifi", name: "WiFi", icon: "wifi", category: "essentials" },
  { id: "ac", name: "Air conditioning", icon: "wind", category: "essentials" },
  { id: "heating", name: "Heating", icon: "thermometer", category: "essentials" },
  { id: "kitchen", name: "Kitchen", icon: "utensils", category: "essentials" },
  { id: "washer", name: "Washer", icon: "washing-machine", category: "essentials" },
  { id: "dryer", name: "Dryer", icon: "wind", category: "essentials" },
  { id: "tv", name: "TV", icon: "tv", category: "essentials" },

  // Features
  { id: "pool", name: "Pool", icon: "waves", category: "features" },
  { id: "hot-tub", name: "Hot tub", icon: "bath", category: "features" },
  { id: "gym", name: "Gym", icon: "dumbbell", category: "features" },
  { id: "bbq", name: "BBQ grill", icon: "flame", category: "features" },
  { id: "balcony", name: "Balcony", icon: "home", category: "features" },
  { id: "garden", name: "Garden", icon: "tree", category: "features" },
  { id: "beach-access", name: "Beach access", icon: "umbrella", category: "features" },

  // Safety
  { id: "smoke-alarm", name: "Smoke alarm", icon: "alert-circle", category: "safety" },
  { id: "carbon-monoxide", name: "Carbon monoxide alarm", icon: "alert-triangle", category: "safety" },
  { id: "fire-extinguisher", name: "Fire extinguisher", icon: "shield", category: "safety" },
  { id: "first-aid", name: "First aid kit", icon: "cross", category: "safety" },

  // Outdoor
  { id: "parking", name: "Free parking", icon: "car", category: "outdoor" },
  { id: "outdoor-dining", name: "Outdoor dining area", icon: "utensils", category: "outdoor" },
  { id: "outdoor-shower", name: "Outdoor shower", icon: "droplet", category: "outdoor" },
]

export function getAmenityCategories(): AmenityCategory[] {
  return amenityCategories.sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getAmenitiesByCategory(categoryId: string): Amenity[] {
  return PREDEFINED_AMENITIES.filter((a) => a.category === categoryId)
}

export function addAmenityCategory(category: Omit<AmenityCategory, "id">): AmenityCategory {
  const newCategory: AmenityCategory = {
    ...category,
    id: Date.now().toString(),
  }
  amenityCategories.push(newCategory)
  return newCategory
}

export function addAmenity(amenity: Omit<Amenity, "id">): Amenity {
  const newAmenity: Amenity = {
    ...amenity,
    id: `custom-${Date.now()}`,
  }
  PREDEFINED_AMENITIES.push(newAmenity)
  return newAmenity
}

export function updateAmenity(id: string, updates: Partial<Amenity>): void {
  const index = PREDEFINED_AMENITIES.findIndex((a) => a.id === id)
  if (index !== -1) {
    PREDEFINED_AMENITIES[index] = { ...PREDEFINED_AMENITIES[index], ...updates }
  }
}

export function deleteAmenity(id: string): void {
  PREDEFINED_AMENITIES = PREDEFINED_AMENITIES.filter((a) => a.id !== id)
}
