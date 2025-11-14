"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Loader2, CheckCircle2, Settings, FileText, ImageIcon, Home } from 'lucide-react'
import Link from "next/link"

interface CMSContent {
  id: string
  key: string
  value: string
  section: string
  label: string
}

export default function AdminDashboard() {
  const [content, setContent] = useState<CMSContent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [editedContent, setEditedContent] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchContent()
  }, [])

 const fetchContent = async () => {
  try {
    // DISABLED - causing timeout
    // const response = await fetch("/api/cms/content")
    
    // Use empty array so page loads
    setContent([])
    setEditedContent({})
  } catch (error) {
    console.error("Failed to fetch content:", error)
  } finally {
    setLoading(false)
  }
}

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)

    try {
      const updates = Object.entries(editedContent).map(([key, value]) => ({
        key,
        value,
      }))

      const response = await fetch("/api/cms/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      })

      if (response.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
        await fetchContent()
      }
    } catch (error) {
      console.error("Failed to save content:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setEditedContent((prev) => ({ ...prev, [key]: value }))
  }

  const getContentBySection = (section: string) => {
    return content.filter((item) => item.section === section)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-serif font-bold">CMS Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              {saveSuccess && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Saved successfully</span>
                </div>
              )}
              <Link href="/">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Home className="h-4 w-4" />
                  View Site
                </Button>
              </Link>
              <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary hover:bg-primary/90">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="homepage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="homepage" className="gap-2">
              <Home className="h-4 w-4" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="listings" className="gap-2">
              <FileText className="h-4 w-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Homepage Content */}
          <TabsContent value="homepage" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Hero Section</h2>
                <Badge variant="secondary">Homepage</Badge>
              </div>

              <div className="space-y-6">
                {getContentBySection("homepage").map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label htmlFor={item.key}>{item.label}</Label>
                    {item.key.includes("title") || item.key.includes("cta") ? (
                      <Input
                        id={item.key}
                        value={editedContent[item.key] || ""}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        placeholder={item.label}
                        className="text-base"
                      />
                    ) : (
                      <Textarea
                        id={item.key}
                        value={editedContent[item.key] || ""}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        placeholder={item.label}
                        rows={3}
                        className="text-base"
                      />
                    )}
                    <p className="text-xs text-muted-foreground">Key: {item.key}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Featured Villas Section</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Featured villas are automatically pulled from Guesty API. The first 3 active listings are displayed.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input value="Featured Villas" disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">This will be editable in a future update</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Listings Content */}
          <TabsContent value="listings" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Listings Management</h2>
                <Link href="/admin/properties">
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Properties
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-accent/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Property Management System</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Manage your villa properties with full control over descriptions, images, amenities, and Guesty
                    integration. Click "Manage Properties" to edit villa details, add highlights, and configure
                    availability settings.
                  </p>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">What you can customize:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Property details, descriptions, and highlights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Featured status and villa ordering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Amenities selection from predefined list</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Image galleries with category assignments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Guesty API integration via unique property codes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Media Content */}
          <TabsContent value="media" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Media Library</h2>
              <div className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Media Management Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Upload and manage images for your homepage hero, property galleries, and other marketing materials.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Site Settings</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input value="Tropically" className="text-base" />
                </div>

                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input value="hello@tropically.com" type="email" className="text-base" />
                </div>

                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input value="+62 XXX XXX XXX" type="tel" className="text-base" />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value="Bali, Indonesia" className="text-base" />
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold mb-4">API Integration</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Guesty Webhook URL</Label>
                      <Input
                        value={process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "Not configured"}
                        disabled
                        className="bg-muted font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Bearer token is fetched from this webhook endpoint
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-accent/50">
              <h3 className="font-semibold mb-2">Environment Variables</h3>
              <p className="text-sm text-muted-foreground mb-4">Configure these in your Vercel project settings:</p>
              <div className="space-y-2 font-mono text-xs">
                <code className="block p-2 bg-background rounded">N8N_WEBHOOK_URL</code>
                <code className="block p-2 bg-background rounded">NEXT_PUBLIC_N8N_WEBHOOK_URL</code>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
