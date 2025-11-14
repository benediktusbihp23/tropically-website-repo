import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { propertyId: string; categoryId: string } }
) {
  try {
    const supabase = await createClient()

    // Check if there are amenities under this category
    const { count } = await supabase
      .from("property_amenities_custom")
      .select("*", { count: "exact", head: true })
      .eq("category_id", params.categoryId)

    // Delete category (amenities will cascade due to ON DELETE CASCADE)
    const { error } = await supabase
      .from("property_categories")
      .delete()
      .eq("id", params.categoryId)

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      message: `Category and ${count || 0} amenities deleted` 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
