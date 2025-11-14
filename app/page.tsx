import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/homepage/hero-section"
import { FeaturedVillas } from "@/components/homepage/featured-villas"
import { FeaturesSection } from "@/components/homepage/features-section"
import { CTASection } from "@/components/homepage/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <HeroSection />
        <FeaturedVillas />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
