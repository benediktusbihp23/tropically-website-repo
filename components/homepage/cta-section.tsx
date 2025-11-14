import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 text-balance">
          Ready to Experience Paradise?
        </h2>
        <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 text-pretty leading-relaxed">
          Book your dream villa today and create memories that last a lifetime
        </p>
        <Link href="/villas">
          <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold">
            Start Your Journey
          </Button>
        </Link>
      </div>
    </section>
  )
}
