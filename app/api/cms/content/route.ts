import { NextResponse } from "next/server"

const mockContent = [
  {
    id: "1",
    key: "hero-title",
    value: "Discover Paradise in Bali",
    section: "homepage",
    label: "Hero Title",
  },
  {
    id: "2",
    key: "hero-subtitle",
    value: "Luxury villas and unforgettable experiences",
    section: "homepage",
    label: "Hero Subtitle",
  },
  {
    id: "3",
    key: "hero-cta",
    value: "Explore Villas",
    section: "homepage",
    label: "Hero CTA Button",
  },
]

export async function GET() {
  console.log('[CMS API] GET request received')
  return NextResponse.json(mockContent)
}

export async function PUT(request: Request) {
  console.log('[CMS API] PUT request received')
  const body = await request.json()
  console.log('[CMS API] Update:', body)
  return NextResponse.json({ success: true })
}
