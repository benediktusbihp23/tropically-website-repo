import { Card } from "@/components/ui/card"
import { Sparkles, MapPin, Shield, Clock } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Luxury Properties",
    description: "Handpicked villas with stunning views and premium amenities",
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    description: "Strategic locations close to beaches, restaurants, and attractions",
  },
  {
    icon: Shield,
    title: "Verified & Secure",
    description: "All properties verified with secure booking and payment",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance for a seamless experience",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            Why Choose Tropically
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            We make your Bali experience unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
