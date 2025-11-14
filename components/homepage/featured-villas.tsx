import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Bed, Bath } from "lucide-react"
import Link from "next/link"
import { getCMSProperties } from "@/lib/cms-properties-data"

export async function FeaturedVillas() {
  let listings = []

  try {
    const allProperties = await getCMSProperties()
    // Show featured properties only, limit to 3
    listings = allProperties
      .filter((property) => property.featured && property.active)
      .slice(0, 3)
      .map((property) => ({
        _id: property.id,
        slug: property.slug,
        nickname: property.title,
        location: property.location,
        address: {
          city: property.location.split(",")[0].trim(),
          country: "Indonesia",
        },
        accommodates: property.guests,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        picture: {
          large: property.images.find((img) => img.isMainGallery)?.url || "/placeholder.svg",
        },
        prices: {
          basePrice: 0,
          currency: "USD",
        },
      }))
  } catch (error) {
    console.error("Failed to load featured villas:", error)
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Featured Villas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Handpicked collection of our most stunning properties
          </p>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {listings.map((listing) => (
              <Link key={listing._id} href={`/villas/${listing.slug || listing._id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                  <div className="relative h-64">
                    <img
                      src={listing.picture?.large || "/placeholder.svg?height=400&width=600&query=bali villa"}
                      alt={listing.nickname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{listing.nickname}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                      <MapPin className="h-4 w-4" />
                      {listing.address?.city || "Bali"}, Indonesia
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {listing.accommodates} guests
                      </span>
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {listing.bedrooms} beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {listing.bathrooms} baths
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">${listing.prices?.basePrice || "---"}</span>
                        <span className="text-sm text-muted-foreground"> / night</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No villas available at the moment.</p>
          </div>
        )}

        <div className="text-center">
          <Link href="/villas">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8">
              View All Villas
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
