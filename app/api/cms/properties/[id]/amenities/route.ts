import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("property_amenities_custom")
      .select("*")
      .eq("property_id", id)
      .order("display_order")

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    console.log("[v0] Saving amenity to property:", id, body)

    const { data, error } = await supabase
      .from("property_amenities_custom")
      .insert({
        property_id: id,
        category_id: body.categoryId,
        name: body.name,
        icon: body.icon === "none" ? "" : (body.icon || ""),
        display_order: body.displayOrder || 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving amenity:", error)
      throw error
    }

    console.log("[v0] Amenity saved successfully:", data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Exception in POST amenity:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
