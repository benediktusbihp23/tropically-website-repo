import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ propertyId: string }> }) {
  try {
    const { propertyId } = await params
    const supabase = await createClient()

    console.log("[v0] Fetching categories for property:", propertyId)

    const { data: categories, error } = await supabase
      .from("property_categories")
      .select("*")
      .eq("property_id", propertyId)
      .order("display_order")

    if (error) throw error

    if (categories && categories.length > 0) {
      const categoriesWithAmenities = await Promise.all(
        categories.map(async (category) => {
          const { data: amenities } = await supabase
            .from("property_amenities_custom")
            .select("*")
            .eq("category_id", category.id)
            .order("display_order")
          
          return {
            ...category,
            property_amenities_new: amenities || []
          }
        })
      )
      console.log("[v0] Fetched", categoriesWithAmenities.length, "categories with", categoriesWithAmenities.reduce((sum, cat) => sum + (cat.property_amenities_new?.length || 0), 0), "total amenities")
      return NextResponse.json(categoriesWithAmenities)
    }

    return NextResponse.json(categories || [])
  } catch (error: any) {
    console.error("[v0] Exception in GET categories:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ propertyId: string }> }) {
  try {
    const { propertyId } = await params
    const supabase = await createClient()
    const body = await request.json()

    console.log("[v0] Adding category to property:", propertyId, body)

    const { data, error } = await supabase
      .from("property_categories")
      .insert({
        property_id: propertyId,
        name: body.name,
        display_order: body.displayOrder || 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error adding category:", error)
      throw error
    }

    console.log("[v0] Category added successfully:", data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Exception in POST category:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
