import { NextResponse } from "next/server"
import { getCMSProperties } from "@/lib/cms-properties-data"

export async function GET() {
  try {
    const properties = await getCMSProperties()

    console.log("[v0] Fetched properties from CMS:", properties.length)

    // Filter only active listings
    const activeListings = properties.filter((property) => property.active)

    // Map CMS properties to listing format
    const listings = activeListings.map((property) => ({
      _id: property.id,
      slug: property.slug, // Include slug for URL routing
      nickname: property.title,
      location: property.location,
      address: {
        city: property.location,
        country: "Indonesia",
      },
      accommodates: property.guests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      prices: {
        basePrice: 0, // Price comes from API call
        currency: "USD",
      },
      picture: {
        large: property.images.find((img) => img.isMainGallery)?.url || "/placeholder.svg",
      },
      images: property.images
        .filter((img) => img.isMainGallery)
        .sort((a, b) => a.sortOrder - b.sortOrder),
      pictures: property.images
        .filter((img) => img.isMainGallery)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((img) => ({
          original: img.url,
          thumbnail: img.url,
          caption: img.url.split("/").pop() || "",
        })),
      publicDescription: {
        summary: property.description,
      },
      description: property.description,
      featured: property.featured,
      tags: property.featured ? ["featured"] : [],
      active: true,
    }))

    return NextResponse.json(listings)
  } catch (error) {
    console.error("[API] Failed to fetch listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}
