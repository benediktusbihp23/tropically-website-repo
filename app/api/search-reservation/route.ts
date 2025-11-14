import { NextResponse } from "next/server"
import { searchReservation } from "@/lib/guesty-api"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { confirmationCode } = body

    if (!confirmationCode) {
      return NextResponse.json({ error: "Confirmation code is required" }, { status: 400 })
    }

    const reservation = await searchReservation(confirmationCode)

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("[API] Failed to search reservation:", error)
    return NextResponse.json({ error: "Failed to find reservation" }, { status: 500 })
  }
}
