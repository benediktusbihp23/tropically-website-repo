import { NextResponse } from "next/server"
import { getAllCMSProperties, createCMSProperty, updateCMSProperty } from "@/lib/cms-properties-data"

export async function GET() {
  try {
    const properties = await getAllCMSProperties()
    return NextResponse.json(properties)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const property = await createCMSProperty(body)
    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    await updateCMSProperty(id, updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  }
}
