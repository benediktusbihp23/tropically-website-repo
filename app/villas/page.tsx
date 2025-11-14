"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { VillaFilters, type FilterState } from "@/components/villas/villa-filters"
import { VillaCard } from "@/components/villas/villa-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { useState, useEffect } from "react"
import type { GuestyListing } from "@/lib/types"

export default function VillasPage() {
  const [listings, setListings] = useState<GuestyListing[]>([])
  const [filteredListings, setFilteredListings] = useState<GuestyListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(9)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/listings")

      if (!response.ok) {
        throw new Error("Failed to fetch listings")
      }

      const data = await response.json()
      setListings(data)
      setFilteredListings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load villas")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...listings]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (listing) =>
          listing.nickname.toLowerCase().includes(searchLower) ||
          listing.address?.city?.toLowerCase().includes(searchLower) ||
          listing.publicDescription?.summary?.toLowerCase().includes(searchLower),
      )
    }

    // Price filter
    filtered = filtered.filter(
      (listing) =>
        listing.prices?.basePrice >= filters.minPrice &&
        (filters.maxPrice >= 1000 || listing.prices?.basePrice <= filters.maxPrice),
    )

    // Bedrooms filter
    if (filters.bedrooms !== "any") {
      const minBedrooms = Number.parseInt(filters.bedrooms)
      filtered = filtered.filter((listing) => listing.bedrooms >= minBedrooms)
    }

    // Guests filter
    if (filters.guests !== "any") {
      const minGuests = Number.parseInt(filters.guests)
      filtered = filtered.filter((listing) => listing.accommodates >= minGuests)
    }

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.prices?.basePrice || 0) - (b.prices?.basePrice || 0))
        break
      case "price-high":
        filtered.sort((a, b) => (b.prices?.basePrice || 0) - (a.prices?.basePrice || 0))
        break
      case "guests":
        filtered.sort((a, b) => b.accommodates - a.accommodates)
        break
      case "bedrooms":
        filtered.sort((a, b) => b.bedrooms - a.bedrooms)
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredListings(filtered)
    setDisplayCount(9) // Reset pagination when filters change
  }

  const visibleListings = filteredListings.slice(0, displayCount)
  const hasMore = displayCount < filteredListings.length

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Header */}
        <section className="bg-muted/30 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
              Luxury Villas in Bali
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty leading-relaxed">
              Discover your perfect villa from our handpicked collection of luxury properties
            </p>
          </div>
        </section>

        {/* Filters and Listings */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <VillaFilters onFilterChange={handleFilterChange} />

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchListings}>Try Again</Button>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg mb-2">No villas found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters to see more results</p>
              </div>
            ) : (
              <>
                <div className="mb-6 text-sm text-muted-foreground">
                  Showing {visibleListings.length} of {filteredListings.length} villas
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {visibleListings.map((listing) => (
                    <VillaCard key={listing._id} listing={listing} />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setDisplayCount((prev) => prev + 9)}
                      className="h-12 px-8"
                    >
                      Load More Villas
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
