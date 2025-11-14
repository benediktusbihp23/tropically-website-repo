import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; amenityId: string } }
) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("property_amenities_custom")
      .delete()
      .eq("id", params.amenityId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
