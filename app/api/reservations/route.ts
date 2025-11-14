import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { listingId, checkInDateLocalized, checkOutDateLocalized, guestsCount, guest } = body

    if (!listingId || !checkInDateLocalized || !checkOutDateLocalized || !guestsCount || !guest) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In production, this would call the Guesty API to create an actual reservation
    // For now, we'll return a mock confirmation code
    const confirmationCode = `TRP${Date.now().toString().slice(-8).toUpperCase()}`

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      confirmationCode,
      status: "confirmed",
      message: "Reservation created successfully",
    })
  } catch (error) {
    console.error("[API] Failed to create reservation:", error)
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
  }
}
