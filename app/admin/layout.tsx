import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CMS Dashboard | Tropically Admin",
  description: "Content management system for Tropically",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
