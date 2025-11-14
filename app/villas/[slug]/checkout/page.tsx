import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCMSPropertyBySlug } from "@/lib/cms-properties-data"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  const property = await getCMSPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href={`/villas/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to property
          </Link>

          <h1 className="text-3xl font-serif font-bold mb-8">Complete your booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Guest information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
              </Card>

              {/* Special Requests */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Special requests</h2>
                <div>
                  <Label htmlFor="requests">Additional information</Label>
                  <textarea
                    id="requests"
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-950"
                    placeholder="Let us know if you have any special requests..."
                  />
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment method</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment details will be processed securely through our booking system.
                </p>
              </Card>

              <Button size="lg" className="w-full">
                Confirm booking
              </Button>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Booking summary</h2>
                
                <div className="space-y-4">
                  {/* Property Image and Name */}
                  <div className="flex gap-4">
                    <img
                      src={property.images?.[0]?.url || "/placeholder.svg?height=80&width=80&query=villa"}
                      alt={property.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold">{property.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {property.location || "Bali, Indonesia"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Check-in</span>
                      <span className="font-medium">Select dates</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Check-out</span>
                      <span className="font-medium">Select dates</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Guests</span>
                      <span className="font-medium">Up to {property.guests}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Pricing and availability will be confirmed in the next step.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
