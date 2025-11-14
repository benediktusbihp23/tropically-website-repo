import { NextResponse } from "next/server"
import { getListingAvailability } from "@/lib/guesty-api"
import { getCMSPropertyById } from "@/lib/cms-properties-data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!from || !to) {
      return NextResponse.json({ error: "Missing from or to parameters" }, { status: 400 })
    }

    // Get property from CMS to retrieve guestyCode
    const property = await getCMSPropertyById(params.id)

    if (!property || !property.guestyCode) {
      return NextResponse.json({ error: "Property not found or missing Guesty configuration" }, { status: 404 })
    }

    // Use guestyCode for API call (not the CMS ID)
    const availability = await getListingAvailability(property.guestyCode, from, to)
    return NextResponse.json(availability)
  } catch (error) {
    console.error("[API] Failed to fetch availability:", error)
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
  }
}
