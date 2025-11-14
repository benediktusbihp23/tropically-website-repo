import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DatePickerWithAvailability } from "@/components/date-picker-with-availability"
import { GuestSelector } from "@/components/guest-selector"
import { MapPin, Users, Bed, Bath, Star, Share2, Heart } from 'lucide-react'
import { createClient } from "@/lib/supabase/server"
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function VillaDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  const { data: property, error } = await supabase
    .from('properties')
    .select(`
      *,
      property_categories (
        id,
        name,
        amenities:property_amenities_custom (
          id,
          name,
          icon
        )
      )
    `)
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (error || !property) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Image Gallery */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-4 gap-2 h-[500px]">
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-l-xl">
              <img
                src={property.images?.[0]?.url || "/placeholder.svg?height=800&width=1200&query=luxury bali villa"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            {property.images?.slice(1, 5).map((img: any, index: number) => (
              <div
                key={img.id}
                className={`relative overflow-hidden ${index === 1 ? 'rounded-tr-xl' : ''} ${index === 3 ? 'rounded-br-xl' : ''}`}
              >
                <img
                  src={img.url || "/placeholder.svg?height=400&width=600&query=villa interior"}
                  alt={`Villa view ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4 mt-4">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Heart className="h-4 w-4" />
              Save
            </Button>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title */}
              <div className="border-b border-border pb-6">
                <h1 className="text-3xl font-serif font-bold mb-3">{property.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {property.address || "Bali, Indonesia"}
                  </span>
                  {property.featured && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {property.guests} guests
                  </span>
                  <span className="flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    {property.bedrooms} bedrooms
                  </span>
                  <span className="flex items-center gap-2">
                    <Bath className="h-5 w-5" />
                    {property.bathrooms} bathrooms
                  </span>
                </div>
              </div>

              {/* Description with HTML rendering */}
              {property.description && (
                <div className="border-b border-border pb-6">
                  <h2 className="text-xl font-semibold mb-4">About this place</h2>
                  <div 
                    className="text-muted-foreground leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: property.description }}
                  />
                </div>
              )}

              {/* Highlights */}
              {property.highlights && property.highlights.length > 0 && property.show_highlights && (
                <div className="border-b border-border pb-6">
                  <h2 className="text-xl font-semibold mb-4">Property Highlights</h2>
                  <div className="space-y-4">
                    {property.highlights.map((highlight: any) => (
                      <div key={highlight.id} className="flex gap-3">
                        {highlight.icon && <span className="text-2xl">{highlight.icon}</span>}
                        <div>
                          <h3 className="font-semibold">{highlight.title}</h3>
                          <p className="text-sm text-muted-foreground">{highlight.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities by Category */}
              {property.property_categories && property.property_categories.length > 0 && (
                <div className="border-b border-border pb-6">
                  <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
                  <div className="space-y-6">
                    {property.property_categories.map((category: any) => (
                      <div key={category.id}>
                        <h3 className="font-semibold mb-3 capitalize">{category.name}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {category.amenities?.map((amenity: any) => (
                            <div key={amenity.id} className="flex items-center gap-3">
                              {amenity.icon && <span className="text-xl">{amenity.icon}</span>}
                              <span>{amenity.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Card - Uses guestyCode for API calls */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 p-6 shadow-xl">
                <div className="mb-4">
                  <div className="text-2xl font-semibold">Select dates for pricing</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Booking widget coming soon. Property code: {property.guesty_code}
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
