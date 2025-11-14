import { NextResponse, NextRequest } from "next/server"
import { getCMSPropertyBySlug } from "@/lib/cms-properties-data"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const property = await getCMSPropertyBySlug(params.slug)

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Get only main gallery images
    const galleryImages = property.images
      .filter((img) => img.isMainGallery)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => img.url)

    // Map CMS property to expected listing format
    const listing = {
      _id: property.id,
      nickname: property.title,
      subtitle: property.subtitle,
      accommodates: property.guests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      address: {
        city: property.location.split(",")[0].trim(),
        full: property.address,
      },
      publicDescription: {
        summary: property.description,
      },
      amenities: property.amenities,
      highlights: property.showHighlights ? property.highlights : [],
      picture: {
        large: galleryImages[0] || "/placeholder.svg?height=800&width=1200",
      },
      pictures: galleryImages.map((url, index) => ({
        _id: `img-${index}`,
        regular: url,
        caption: `${property.title} view ${index + 1}`,
      })),
      // Include guestyCode for backend API calls (not displayed on frontend)
      guestyCode: property.guestyCode,
      // Include property-specific categories and amenities
      propertyCategories: property.propertyCategories || [],
      // Include categorized images for display at bottom of page
      categorizedImages: property.images.filter((img) => !img.isMainGallery && img.category !== "general"),
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error("[API] Error fetching property:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
