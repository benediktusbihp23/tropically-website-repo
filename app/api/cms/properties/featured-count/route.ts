import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { count, error } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true)

    if (error) throw error

    return NextResponse.json({ count: count || 0, limit: 10 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
