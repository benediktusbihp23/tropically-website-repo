import { NextResponse } from "next/server"
import { getQuote } from "@/lib/guesty-api"
import { getCMSPropertyById } from "@/lib/cms-properties-data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { listingId, checkInDateLocalized, checkOutDateLocalized, guestsCount } = body

    if (!listingId || !checkInDateLocalized || !checkOutDateLocalized || !guestsCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get property from CMS to retrieve guestyCode
    const property = await getCMSPropertyById(listingId)

    if (!property || !property.guestyCode) {
      return NextResponse.json({ error: "Property not found or missing Guesty configuration" }, { status: 404 })
    }

    // Use guestyCode for API call (not the CMS ID)
    const quote = await getQuote({
      listingId: property.guestyCode,
      checkInDateLocalized,
      checkOutDateLocalized,
      guestsCount,
    })

    const price = quote.rates?.ratePlans?.[0]?.ratePlan?.money?.fareAccommodation

    if (!price) {
      return NextResponse.json({ error: "Not available for selected dates" }, { status: 400 })
    }

    return NextResponse.json({ price, quoteId: quote._id })
  } catch (error) {
    console.error("[API] Failed to get quote:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to get quote" }, { status: 500 })
  }
}
