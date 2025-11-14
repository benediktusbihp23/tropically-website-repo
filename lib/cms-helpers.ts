import type { CMSContent } from "./types"

const cmsContent: Record<string, CMSContent> = {
  "hero-title": {
    id: "1",
    key: "hero-title",
    type: "text",
    value: "Discover Paradise in Bali",
    section: "homepage",
    label: "Hero Title",
    updatedAt: new Date().toISOString(),
  },
  "hero-subtitle": {
    id: "2",
    key: "hero-subtitle",
    type: "text",
    value: "Luxury villas and unforgettable experiences in the heart of Bali",
    section: "homepage",
    label: "Hero Subtitle",
    updatedAt: new Date().toISOString(),
  },
  "hero-cta": {
    id: "3",
    key: "hero-cta",
    type: "text",
    value: "Explore Villas",
    section: "homepage",
    label: "Hero CTA Button",
    updatedAt: new Date().toISOString(),
  },
  "features-title": {
    id: "4",
    key: "features-title",
    type: "text",
    value: "Why Choose Tropically",
    section: "homepage",
    label: "Features Section Title",
    updatedAt: new Date().toISOString(),
  },
  "features-subtitle": {
    id: "5",
    key: "features-subtitle",
    type: "text",
    value: "We make your Bali experience unforgettable",
    section: "homepage",
    label: "Features Section Subtitle",
    updatedAt: new Date().toISOString(),
  },
}

export async function getCMSContent(key: string): Promise<string> {
  // In production, fetch from database
  return cmsContent[key]?.value || ""
}

export async function getCMSContentBySection(section: string): Promise<CMSContent[]> {
  // In production, fetch from database
  return Object.values(cmsContent).filter((content) => content.section === section)
}

export async function updateCMSContent(key: string, value: string): Promise<void> {
  // In production, update database
  if (cmsContent[key]) {
    cmsContent[key].value = value
    cmsContent[key].updatedAt = new Date().toISOString()
  } else {
    // Create new entry if it doesn't exist
    cmsContent[key] = {
      id: Date.now().toString(),
      key,
      type: "text",
      value,
      section: "custom",
      label: key,
      updatedAt: new Date().toISOString(),
    }
  }
}

export async function getAllCMSContent(): Promise<CMSContent[]> {
  // In production, fetch from database
  return Object.values(cmsContent)
}
