import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data: categories, error: catError } = await supabase
    .from("amenity_categories")
    .select("*")
    .order("sort_order", { ascending: true })

  const { data: amenities, error: amenError } = await supabase.from("amenity_items").select("*").order("name")

  if (catError || amenError) {
    return NextResponse.json({ error: "Failed to fetch amenities" }, { status: 500 })
  }

  return NextResponse.json({ categories, amenities })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const id = body.name.toLowerCase().replace(/\s+/g, "-")

  const { error } = await supabase.from("amenity_items").insert({
    id,
    name: body.name,
    category_id: body.categoryId,
    icon: body.icon || "check",
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
