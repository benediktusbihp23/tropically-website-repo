import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Bed, Bath, Star } from 'lucide-react'
import Link from "next/link"
import type { GuestyListing } from "@/lib/types"

interface VillaCardProps {
  listing: GuestyListing
}

export function VillaCard({ listing }: VillaCardProps) {
  const mainImage = listing.picture?.large || listing.images?.[0]?.url || "/luxury-bali-villa.jpg"

  return (
    <Link href={`/villas/${listing.slug || listing._id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full group">
        <div className="relative h-72 overflow-hidden">
          <img
            src={mainImage || "/placeholder.svg"}
            alt={listing.nickname}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {(listing.tags && listing.tags.includes("featured")) ||
            (listing.featured && (
              <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">Featured</Badge>
            ))}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">5.0</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 text-foreground line-clamp-1">{listing.nickname}</h3>

          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{listing.location || listing.address?.city || "Bali"}, Indonesia</span>
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {listing.accommodates || listing.guests} guests
            </span>
            <span className="flex items-center gap-1.5">
              <Bed className="h-4 w-4" />
              {listing.bedrooms} beds
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" />
              {listing.bathrooms} baths
            </span>
          </div>

          {(listing.description || listing.publicDescription?.summary) && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {listing.description || listing.publicDescription?.summary}
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-2xl font-bold text-primary">${listing.prices?.basePrice || "---"}</span>
              <span className="text-sm text-muted-foreground"> / night</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
