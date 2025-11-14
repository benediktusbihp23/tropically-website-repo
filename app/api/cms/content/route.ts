import { NextResponse } from "next/server"
import { getCMSContentBySection, updateCMSContent } from "@/lib/cms-helpers"

export async function GET() {
  try {
    const homepageContent = await getCMSContentBySection("homepage")
    return NextResponse.json(homepageContent)
  } catch (error) {
    console.error("[API] Failed to fetch CMS content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { updates } = body

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid updates format" }, { status: 400 })
    }

    for (const update of updates) {
      await updateCMSContent(update.key, update.value)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Failed to update CMS content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
