import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Bed, Bath, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { FeaturedVillasCarousel } from "./featured-villas-carousel"

interface Villa {
  id: string
  slug: string
  title: string
  subtitle: string
  location: string
  images: any[]
  guests: number
  bedrooms: number
  bathrooms: number
}

export async function FeaturedVillas() {
  const supabase = await createClient()
  
  const { data: featuredVillas } = await supabase
    .from('properties')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })

  console.log('[v0] Featured villas query result:', featuredVillas?.length || 0, 'villas')

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

        {featuredVillas && featuredVillas.length > 0 ? (
          <div className="mb-8">
            <FeaturedVillasCarousel villas={featuredVillas} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured villas at the moment.</p>
          </div>
        )}

        <div className="text-center mt-8">
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
