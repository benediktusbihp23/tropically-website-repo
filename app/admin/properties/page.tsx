"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Save, X, Star, Loader2, EyeOff, AlertCircle } from 'lucide-react'
import Link from "next/link"
import type { CMSProperty } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/rich-text-editor"

export default function PropertiesManagement() {
  const [properties, setProperties] = useState<CMSProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingProperty, setEditingProperty] = useState<CMSProperty | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [amenityCategories, setAmenityCategories] = useState<any[]>([])
  const [allAmenities, setAllAmenities] = useState<any[]>([])
  const [propertyCategories, setPropertyCategories] = useState<any[]>([])
  const [newAmenityName, setNewAmenityName] = useState("")
  const [newAmenityIcon, setNewAmenityIcon] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)
  const [slugWarningOpen, setSlugWarningOpen] = useState(false)
  const [pendingSlug, setPendingSlug] = useState("")
  const [featuredLimitWarning, setFeaturedLimitWarning] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProperties()
    fetchAmenities()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/cms/properties")
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error)
      toast({
        title: "Error",
        description: "Failed to load properties. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAmenities = async () => {
    try {
      const response = await fetch("/api/cms/amenities")
      if (response.ok) {
        const data = await response.json()
        setAmenityCategories(data.categories || [])
        setAllAmenities(data.amenities || [])
      }
    } catch (error) {
      console.error("Failed to fetch amenities:", error)
    }
  }

  const fetchPropertyCategories = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/cms/properties/${propertyId}/categories`)
      if (response.ok) {
        const data = await response.json()
        setPropertyCategories(data)
      }
    } catch (error) {
      console.error("Failed to fetch property categories:", error)
    }
  }

  const handleEdit = (property: CMSProperty) => {
    setEditingProperty(property)
    setIsDialogOpen(true)
    fetchPropertyCategories(property.id)
  }

  const validateSlug = (slug: string): boolean => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug)
  }

  const handleSlugChange = (newSlug: string) => {
    if (!editingProperty) return

    const formattedSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "")

    if (editingProperty.slug && editingProperty.slug !== formattedSlug) {
      setPendingSlug(formattedSlug)
      setSlugWarningOpen(true)
    } else {
      setEditingProperty({ ...editingProperty, slug: formattedSlug })
    }
  }

  const confirmSlugChange = () => {
    if (editingProperty) {
      setEditingProperty({ ...editingProperty, slug: pendingSlug })
    }
    setSlugWarningOpen(false)
  }

  const handleFeaturedToggle = (checked: boolean) => {
    if (!editingProperty) return

    if (checked) {
      const featuredCount = properties.filter((p) => p.featured && p.id !== editingProperty.id).length
      if (featuredCount >= 10) {
        setFeaturedLimitWarning(true)
        return
      }
    }

    setEditingProperty({ ...editingProperty, featured: checked })
  }

  const handleSave = async () => {
    if (!editingProperty) return

    // Validate slug
    if (!editingProperty.slug || !validateSlug(editingProperty.slug)) {
      toast({
        title: "Invalid Slug",
        description: "Slug must contain only lowercase letters, numbers, and hyphens.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const response = await fetch("/api/cms/properties", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProperty),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save")
      }

      await fetchProperties()
      setIsDialogOpen(false)
      setEditingProperty(null)

      toast({
        title: "Success",
        description: "Property saved successfully!",
        variant: "success",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save property",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return

    try {
      const response = await fetch(`/api/cms/properties/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchProperties()
        toast({
          title: "Success",
          description: "Property deleted successfully!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      })
    }
  }

  const toggleAmenity = (amenityId: string) => {
    if (!editingProperty) return

    const amenities = editingProperty.amenities.includes(amenityId)
      ? editingProperty.amenities.filter((a) => a !== amenityId)
      : [...editingProperty.amenities, amenityId]

    setEditingProperty({ ...editingProperty, amenities })
  }

  const addHighlight = () => {
    if (!editingProperty) return

    setEditingProperty({
      ...editingProperty,
      highlights: [
        ...editingProperty.highlights,
        {
          id: Date.now().toString(),
          icon: "",
          title: "",
          description: "",
        },
      ],
    })
  }

  const removeHighlight = (id: string) => {
    if (!editingProperty) return

    setEditingProperty({
      ...editingProperty,
      highlights: editingProperty.highlights.filter((h) => h.id !== id),
    })
  }

  const handleAddAmenity = async () => {
    if (!editingProperty || !newAmenityName || !selectedCategory || !newAmenityIcon) return

    try {
      const response = await fetch(`/api/cms/properties/${editingProperty.id}/amenities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategory,
          name: newAmenityName,
          icon: newAmenityIcon,
        }),
      })

      if (response.ok) {
        await fetchPropertyCategories(editingProperty.id)
        setNewAmenityName("")
        setSelectedCategory("")
        setNewAmenityIcon("")
        toast({
          title: "Success",
          description: "Amenity added successfully!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add amenity",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAmenity = async (amenityId: string) => {
    if (!editingProperty) return

    try {
      const response = await fetch(`/api/cms/properties/${editingProperty.id}/amenities/${amenityId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchPropertyCategories(editingProperty.id)
        toast({
          title: "Success",
          description: "Amenity deleted successfully!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete amenity",
        variant: "destructive",
      })
    }
  }

  const handleAddCategory = async () => {
    if (!editingProperty || !newCategoryName) return

    try {
      const response = await fetch(`/api/cms/properties/${editingProperty.id}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      })

      if (response.ok) {
        await fetchPropertyCategories(editingProperty.id)
        setNewCategoryName("")
        toast({
          title: "Success",
          description: "Category added successfully!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!editingProperty) return

    const category = propertyCategories.find(c => c.id === categoryId)
    const amenityCount = category?.amenities?.length || 0

    if (amenityCount > 0) {
      if (!confirm(`Delete this category and ${amenityCount} amenities under it? This action cannot be undone.`)) {
        return
      }
    }

    try {
      const response = await fetch(`/api/cms/properties/${editingProperty.id}/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchPropertyCategories(editingProperty.id)
        toast({
          title: "Success",
          description: "Category deleted successfully!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const featuredCount = properties.filter((p) => p.featured).length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Properties Management</h1>
            <p className="text-muted-foreground">
              Manage your villa listings and details • Featured villas: {featuredCount}/10
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative h-48">
                <img
                  src={property.images[0]?.url || "/placeholder.svg?height=400&width=600"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {property.featured && (
                  <Badge className="absolute top-2 right-2 bg-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {!property.active && (
                  <Badge variant="secondary" className="absolute top-2 left-2">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Hidden
                  </Badge>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{property.subtitle}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span>{property.guests} guests</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEdit(property)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(property.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
            </DialogHeader>

            {editingProperty && (
              <Tabs defaultValue="basic" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="highlights">Highlights</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input
                      value={editingProperty.slug || ""}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="luxury-ocean-villa"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      This slug will be used in your URL. Use lowercase letters and hyphens only.
                    </p>
                    {editingProperty.slug && !validateSlug(editingProperty.slug) && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Invalid slug format
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Guesty Code</Label>
                    <Input
                      value={editingProperty.guestyCode}
                      onChange={(e) => setEditingProperty({ ...editingProperty, guestyCode: e.target.value })}
                      placeholder="68638df190b40f00127d1322"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">Used for API calls to fetch availability and pricing</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={editingProperty.title}
                        onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Property Type</Label>
                      <Select
                        value={editingProperty.propertyType}
                        onValueChange={(value) => setEditingProperty({ ...editingProperty, propertyType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="Beach House">Beach House</SelectItem>
                          <SelectItem value="Estate">Estate</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={editingProperty.subtitle}
                      onChange={(e) => setEditingProperty({ ...editingProperty, subtitle: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <RichTextEditor
                      value={editingProperty.description}
                      onChange={(html) => setEditingProperty({ ...editingProperty, description: html })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use the toolbar to format text with bold, italic, and links.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Bedrooms</Label>
                      <Input
                        type="number"
                        value={editingProperty.bedrooms}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            bedrooms: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Bathrooms</Label>
                      <Input
                        type="number"
                        value={editingProperty.bathrooms}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            bathrooms: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Max Guests</Label>
                      <Input
                        type="number"
                        value={editingProperty.guests}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            guests: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={editingProperty.address || ""}
                      onChange={(e) => setEditingProperty({ ...editingProperty, address: e.target.value })}
                      placeholder="Ubud, Bali, Indonesia"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Longitude</Label>
                      <Input
                        type="number"
                        step="0.000001"
                        value={editingProperty.longitude || ""}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            longitude: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                          })
                        }
                        placeholder="115.0881"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Latitude</Label>
                      <Input
                        type="number"
                        step="0.000001"
                        value={editingProperty.latitude || ""}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            latitude: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                          })
                        }
                        placeholder="-8.4095"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Get coordinates from Google Maps
                    </a>
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={editingProperty.featured}
                          onCheckedChange={handleFeaturedToggle}
                        />
                        <Label htmlFor="featured">Featured ({featuredCount}/10)</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="active"
                          checked={editingProperty.active}
                          onCheckedChange={(checked) => setEditingProperty({ ...editingProperty, active: checked })}
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="highlights" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showHighlights"
                        checked={editingProperty.showHighlights}
                        onCheckedChange={(checked) =>
                          setEditingProperty({ ...editingProperty, showHighlights: checked })
                        }
                      />
                      <Label htmlFor="showHighlights">Show highlights section on frontend</Label>
                    </div>
                  </div>

                  {editingProperty.showHighlights && (
                    <div className="space-y-4">
                      {editingProperty.highlights.map((highlight, index) => (
                        <Card key={highlight.id} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold">Highlight {index + 1}</h4>
                            <Button variant="ghost" size="sm" onClick={() => removeHighlight(highlight.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label>Icon</Label>
                              <Select
                                value={highlight.icon || "none"}
                                onValueChange={(value) => {
                                  const iconValue = value === "none" ? "" : value
                                  const updated = editingProperty.highlights.map((h) =>
                                    h.id === highlight.id ? { ...h, icon: iconValue } : h,
                                  )
                                  setEditingProperty({ ...editingProperty, highlights: updated })
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">No Icon</SelectItem>
                                  <SelectItem value="waves">Waves (Pool)</SelectItem>
                                  <SelectItem value="utensils">Utensils (Dining)</SelectItem>
                                  <SelectItem value="wind">Wind (Cooling)</SelectItem>
                                  <SelectItem value="tree">Tree (Garden)</SelectItem>
                                  <SelectItem value="home">Home (Living)</SelectItem>
                                  <SelectItem value="users">Users (Group)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                value={highlight.title}
                                onChange={(e) => {
                                  const updated = editingProperty.highlights.map((h) =>
                                    h.id === highlight.id ? { ...h, title: e.target.value } : h,
                                  )
                                  setEditingProperty({ ...editingProperty, highlights: updated })
                                }}
                                placeholder="Infinity pool paradise"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={highlight.description}
                                onChange={(e) => {
                                  const updated = editingProperty.highlights.map((h) =>
                                    h.id === highlight.id ? { ...h, description: e.target.value } : h,
                                  )
                                  setEditingProperty({ ...editingProperty, highlights: updated })
                                }}
                                placeholder="Private infinity pool with breathtaking ocean views..."
                                rows={2}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}

                      <Button variant="outline" onClick={addHighlight} className="w-full bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Highlight
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="amenities" className="mt-4">
                  <div className="space-y-6">
                    {/* Add Category */}
                    <Card className="p-4 bg-accent/30">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Category
                      </h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Category name (e.g., Essentials, Features)"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <Button onClick={handleAddCategory}>Add</Button>
                      </div>
                    </Card>

                    {/* Categories List with Amenities */}
                    {propertyCategories.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>No categories yet. Add one above to get started.</p>
                      </div>
                    ) : (
                      propertyCategories.map((category) => (
                        <Card key={category.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          {/* Amenities in this category */}
                          <div className="space-y-2 mb-4">
                            {category.property_amenities_new?.map((amenity: any) => (
                              <div
                                key={amenity.id}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  {amenity.icon && <span className="text-xl">{amenity.icon}</span>}
                                  <span>{amenity.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAmenity(amenity.id)}
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          {/* Add Amenity to this Category */}
                          <Card className="p-3 bg-accent/30">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Amenity name"
                                value={category.id === selectedCategory ? newAmenityName : ""}
                                onChange={(e) => {
                                  setSelectedCategory(category.id)
                                  setNewAmenityName(e.target.value)
                                }}
                                onFocus={() => setSelectedCategory(category.id)}
                              />
                              <Select
                                value={category.id === selectedCategory ? newAmenityIcon : "none"}
                                onValueChange={(val) => {
                                  setSelectedCategory(category.id)
                                  setNewAmenityIcon(val)
                                }}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue placeholder="Icon" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">No Icon</SelectItem>
                                  <SelectItem value="🏊">🏊 Pool</SelectItem>
                                  <SelectItem value="❄️">❄️ AC</SelectItem>
                                  <SelectItem value="🌡️">🌡️ Heating</SelectItem>
                                  <SelectItem value="📶">📶 WiFi</SelectItem>
                                  <SelectItem value="🍳">🍳 Kitchen</SelectItem>
                                  <SelectItem value="🌊">🌊 Ocean View</SelectItem>
                                  <SelectItem value="🌾">🌾 Rice Field</SelectItem>
                                  <SelectItem value="🏖️">🏖️ Beach</SelectItem>
                                  <SelectItem value="🌳">🌳 Garden</SelectItem>
                                  <SelectItem value="💨">💨 Fan</SelectItem>
                                  <SelectItem value="🅿️">🅿️ Parking</SelectItem>
                                  <SelectItem value="📺">📺 TV</SelectItem>
                                  <SelectItem value="🔥">🔥 Fireplace</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                onClick={() => {
                                  if (selectedCategory === category.id && newAmenityName) {
                                    handleAddAmenity()
                                  }
                                }}
                              >
                                + Add
                              </Button>
                            </div>
                          </Card>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="images" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {editingProperty.images.map((image) => (
                        <div key={image.id} className="relative aspect-video">
                          <img
                            src={image.url || "/placeholder.svg?height=400&width=600"}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Badge className="absolute top-2 left-2 text-xs">{image.category || "general"}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={slugWarningOpen} onOpenChange={setSlugWarningOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Warning: Changing Slug
              </AlertDialogTitle>
              <AlertDialogDescription>
                Changing this slug will affect your SEO rankings and break existing links. Are you sure you want to
                proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSlugWarningOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmSlugChange}>Yes, Change Slug</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={featuredLimitWarning} onOpenChange={setFeaturedLimitWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Maximum Featured Limit Reached
              </AlertDialogTitle>
              <AlertDialogDescription>
                You already have 10 featured villas. Please unfeature another villa first before featuring this one.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setFeaturedLimitWarning(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
