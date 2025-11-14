"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getCMSContent } from "@/lib/cms-helpers"

export function HeroSection() {
  const [heroTitle, setHeroTitle] = useState("Discover Paradise in Bali")
  const [heroSubtitle, setHeroSubtitle] = useState("Luxury villas and unforgettable experiences in the heart of Bali")
  const [heroCTA, setHeroCTA] = useState("Explore Villas")

  useEffect(() => {
    const loadContent = async () => {
      const title = await getCMSContent("hero-title")
      const subtitle = await getCMSContent("hero-subtitle")
      const cta = await getCMSContent("hero-cta")

      if (title) setHeroTitle(title)
      if (subtitle) setHeroSubtitle(subtitle)
      if (cta) setHeroCTA(cta)
    }

    loadContent()
  }, [])

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/luxury-bali-villa-with-infinity-pool-at-sunset.jpg"
          alt="Luxury Bali Villa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 text-balance">
          {heroTitle}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
          {heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/villas">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg font-semibold"
            >
              <Search className="mr-2 h-5 w-5" />
              {heroCTA}
            </Button>
          </Link>
          <Link href="/guest-handbook">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg font-semibold bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary"
            >
              Guest Access
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
