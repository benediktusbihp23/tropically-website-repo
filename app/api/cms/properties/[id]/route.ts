import { NextResponse } from "next/server"
import { getCMSProperty, deleteCMSProperty } from "@/lib/cms-properties-data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const property = await getCMSProperty(params.id)
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }
    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteCMSProperty(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 })
  }
}
