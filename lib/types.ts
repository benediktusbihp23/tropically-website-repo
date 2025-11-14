// Guesty API Types
export interface GuestyListing {
  _id: string
  nickname: string
  title: string
  publicDescription: {
    summary?: string
    space?: string
    access?: string
    transit?: string
    neighborhood?: string
    notes?: string
  }
  picture: {
    thumbnail: string
    regular: string
    large: string
  }
  pictures: Array<{
    _id: string
    thumbnail: string
    regular: string
    large: string
    caption?: string
  }>
  address: {
    full: string
    street?: string
    city?: string
    state?: string
    country?: string
    lat?: number
    lng?: number
  }
  accommodates: number
  bedrooms: number
  beds: number
  bathrooms: number
  amenities: string[]
  prices: {
    basePrice: number
    currency: string
  }
  tags?: string[]
  active: boolean
}

export interface GuestyAvailability {
  date: string
  status: "available" | "unavailable" | "booked"
  minNights: number
  isBaseMinNights: boolean
  cta: boolean
  ctd: boolean
}

export interface GuestyQuoteRequest {
  listingId: string
  checkInDateLocalized: string
  checkOutDateLocalized: string
  guestsCount: number
}

export interface GuestyQuoteResponse {
  _id: string
  rates: {
    ratePlans: Array<{
      ratePlan: {
        money: {
          fareAccommodation: number
          hostServiceFee: number
          subTotalPrice: number
          currency: string
        }
      }
    }>
  }
}

export interface GuestyReservation {
  _id: string
  confirmationCode: string
  guest: {
    _id: string
    fullName: string
    email: string
    phone?: string
  }
  listing: {
    _id: string
    nickname: string
    picture?: {
      thumbnail: string
    }
    address: {
      full: string
    }
  }
  checkInDateLocalized: string
  checkOutDateLocalized: string
  guestsCount: number
  numberOfGuests: {
    numberOfAdults: number
    numberOfChildren: number
    numberOfInfants: number
  }
  status: string
  money: {
    fareAccommodation: number
    currency: string
  }
}

// CMS Content Types
export interface CMSProperty {
  id: string
  slug: string // URL-friendly identifier
  guestyCode: string // Backend only - used for API calls
  featured: boolean
  sortOrder: number
  title: string
  subtitle: string
  description: string // Supports rich text HTML
  propertyType: string
  bedrooms: number
  bathrooms: number
  guests: number

  longitude?: number
  latitude?: number

  showHighlights: boolean
  highlights: Array<{
    id: string
    icon: string // Can be empty string for "no icon"
    title: string
    description: string
  }>

  // Image management
  images: Array<{
    id: string
    url: string
    category?: "kitchen" | "bedroom" | "bathroom" | "living-room" | "outdoor" | "pool" | "dining" | "general"
    isMainGallery: boolean
    sortOrder: number
  }>

  // Property-specific categories (optional field for backward compatibility)
  propertyCategories?: PropertyCategory[]

  // Fallback amenities (for properties without custom categories)
  amenities?: string[]

  // Location
  location?: string
  address: string

  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Amenity {
  id: string
  name: string
  icon: string
  category: string // Changed from union type to string to allow custom categories
}

export interface AmenityCategory {
  id: string
  name: string
  sortOrder: number
}

export interface CMSContent {
  id: string
  key: string
  type: "text" | "html" | "image" | "json"
  value: string
  section: string
  label: string
  updatedAt: string
}

export interface BookingDetails {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  infants: number
  pets: number
  price: number
  nights: number
}

// Property-specific amenity types
export interface PropertyCategory {
  id: string
  propertyId: number
  name: string
  displayOrder: number
  amenities: PropertyAmenity[]
}

export interface PropertyAmenity {
  id: string
  propertyId: number
  categoryId: string
  name: string
  icon?: string
  displayOrder: number
}

// Image management types
export interface ImageCategory {
  id: string;
  property_id: string;
  name: string;
  display_order: number;
  created_at: string;
  property_images?: PropertyImage[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  category_id: string;
  url: string;
  is_featured: boolean;
  display_order: number;
  file_size?: number;
  original_filename?: string;
  created_at: string;
}
