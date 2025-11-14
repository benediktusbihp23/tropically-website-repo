"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Loader2, CheckCircle2, XCircle, Users, Baby, MapPin, Calendar, ExternalLink } from "lucide-react"

export default function GuestHandbookPage() {
  const [confirmationCode, setConfirmationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [reservationData, setReservationData] = useState<any>(null)

  const handleSearch = async () => {
    if (!confirmationCode.trim()) {
      setNotification({
        type: "error",
        message: "Please enter a confirmation code",
      })
      return
    }

    setLoading(true)
    setNotification(null)
    setReservationData(null)

    try {
      const response = await fetch("/api/search-reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmationCode: confirmationCode.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to find reservation")
      }

      setNotification({
        type: "success",
        message: "Successfully retrieved reservation data",
      })
      setReservationData(data)
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to find reservation",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getUTCFullYear()
    const month = date.toLocaleString("en-GB", { month: "long", timeZone: "UTC" })
    const day = String(date.getUTCDate()).padStart(2, "0")
    const hours = String(date.getUTCHours()).padStart(2, "0")
    const minutes = String(date.getUTCMinutes()).padStart(2, "0")

    return `${day} ${month} ${year} at ${hours}:${minutes}`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Guest Handbook</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome! Enter your confirmation code to access your reservation details
            </p>
          </div>

          {/* Search Card */}
          <Card className="p-8 mb-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="confirmationCode" className="text-sm font-medium">
                  Confirmation Code
                </label>
                <Input
                  id="confirmationCode"
                  type="text"
                  placeholder="Enter your confirmation code"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-12 text-base"
                  disabled={loading}
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Search Reservation
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Notification */}
          {notification && (
            <div
              className={`p-4 rounded-lg flex items-start gap-3 mb-6 ${
                notification.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="font-medium">{notification.message}</p>
            </div>
          )}

          {/* Reservation Details */}
          {reservationData && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Guest Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="text-lg font-semibold">{reservationData.guest?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Number of guests: {reservationData.guestsCount}
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-primary">
                          <span className="text-xl font-bold text-primary">
                            {reservationData.numberOfGuests?.numberOfAdults || 0}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">Adults</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-primary">
                          <span className="text-xl font-bold text-primary">
                            {reservationData.numberOfGuests?.numberOfChildren || 0}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">Children</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Baby className="h-5 w-5 text-primary" />
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-primary">
                          <span className="text-xl font-bold text-primary">
                            {reservationData.numberOfGuests?.numberOfInfants || 0}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">Infants</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Stay Details</h2>
                {reservationData.listing?.picture?.thumbnail && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <img
                      src={reservationData.listing.picture.thumbnail || "/placeholder.svg"}
                      alt={reservationData.listing?.nickname || "Villa"}
                      className="w-full h-[400px] object-cover"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Villa</p>
                    <p className="text-lg font-semibold">{reservationData.listing?.nickname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </p>
                    <p className="text-base">{reservationData.listing?.address?.full}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Check In
                      </p>
                      <p className="text-base font-semibold">{reservationData.checkInDateLocalized}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Check Out
                      </p>
                      <p className="text-base font-semibold">{reservationData.checkOutDateLocalized}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Details of Your Stay</h2>
                <a
                  href="https://tropically.com/guest-info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/90 font-medium text-lg underline decoration-2 underline-offset-4 transition-colors"
                >
                  Access Here
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
