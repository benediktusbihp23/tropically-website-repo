import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const id = body.name.toLowerCase().replace(/\s+/g, "-")

  const { data: maxSort } = await supabase
    .from("amenity_categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single()

  const sortOrder = (maxSort?.sort_order || 0) + 1

  const { error } = await supabase.from("amenity_categories").insert({
    id,
    name: body.name,
    sort_order: sortOrder,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
