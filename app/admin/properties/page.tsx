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
import EmojiPickerButton from "@/components/EmojiPicker"
import PropertyImagesManager from "@/components/PropertyImagesManager"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProperties, setFilteredProperties] = useState<CMSProperty[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchProperties()
    fetchAmenities()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProperties(properties)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = properties.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.subtitle?.toLowerCase().includes(query) ||
        property.address?.toLowerCase().includes(query) ||
        property.slug?.toLowerCase().includes(query)
      )
      setFilteredProperties(filtered)
    }
  }, [searchQuery, properties])

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

  const handleActiveToggle = (checked: boolean) => {
    if (!editingProperty) return

    if (!checked && editingProperty.featured) {
      const confirmed = confirm(
        "Disabling Active will also disable Featured status. Continue?"
      )
      if (!confirmed) return
      
      setEditingProperty({ ...editingProperty, active: checked, featured: false })
    } else {
      setEditingProperty({ ...editingProperty, active: checked })
    }
  }

  const handleFeaturedToggle = (checked: boolean) => {
    if (!editingProperty) return

    if (!editingProperty.active) {
      toast({
        title: "Cannot Feature Inactive Property",
        description: "Property must be Active before it can be Featured.",
        variant: "destructive",
      })
      return
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
              Manage your villa listings and details • Featured villas: {featuredCount}
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by name, location, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2"
          />
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredProperties.length} villa(s)
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
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

        {filteredProperties.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No villas found matching "{searchQuery}"
            </p>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Edit Property</DialogTitle>
              {editingProperty && (
                <DialogDescription className="text-base">
                  {editingProperty.title}
                </DialogDescription>
              )}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="active">Active Status</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="active"
                          checked={editingProperty.active}
                          onCheckedChange={handleActiveToggle}
                        />
                        <Label htmlFor="active" className="text-sm text-muted-foreground">
                          {editingProperty.active ? "Property is visible" : "Property is hidden"}
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="featured">Featured</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={editingProperty.featured}
                          onCheckedChange={handleFeaturedToggle}
                          disabled={!editingProperty.active}
                        />
                        <Label htmlFor="featured" className="text-sm text-muted-foreground">
                          {editingProperty.featured ? "Show on homepage" : "Not featured"}
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Property Name</Label>
                    <Input
                      id="title"
                      value={editingProperty.title}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={editingProperty.slug || ""}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="luxury-beach-villa"
                    />
                    <p className="text-xs text-muted-foreground">
                      Used in URL: /villas/{editingProperty.slug || "..."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={editingProperty.subtitle}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, subtitle: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <RichTextEditor
                      value={editingProperty.description}
                      onChange={(value) =>
                        setEditingProperty({ ...editingProperty, description: value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={editingProperty.address}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editingProperty.location || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, location: e.target.value })
                        }
                        placeholder="Ubud, Bali"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={editingProperty.longitude || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, longitude: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="115.2624"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={editingProperty.latitude || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, latitude: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="-8.6500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={editingProperty.bedrooms}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            bedrooms: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        value={editingProperty.bathrooms}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            bathrooms: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guests">Max Guests</Label>
                      <Input
                        id="guests"
                        type="number"
                        value={editingProperty.guests}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            guests: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guestyCode">Guesty Property Code</Label>
                    <Input
                      id="guestyCode"
                      value={editingProperty.guestyCode}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, guestyCode: e.target.value })
                      }
                      placeholder="Enter Guesty property ID"
                    />
                    <p className="text-xs text-muted-foreground">
                      Used to fetch real-time pricing and availability
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="highlights" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label>Property Highlights</Label>
                      <p className="text-sm text-muted-foreground">
                        Key features that make this property stand out
                      </p>
                    </div>
                    <Switch
                      checked={editingProperty.showHighlights !== false}
                      onCheckedChange={(checked) =>
                        setEditingProperty({ ...editingProperty, showHighlights: checked })
                      }
                    />
                  </div>

                  {editingProperty.highlights.map((highlight, index) => (
                    <Card key={highlight.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-medium">Highlight {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHighlight(highlight.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <EmojiPickerButton
                            value={highlight.icon}
                            onChange={(emoji) => {
                              const highlights = editingProperty.highlights.map((h) =>
                                h.id === highlight.id ? { ...h, icon: emoji } : h
                              )
                              setEditingProperty({ ...editingProperty, highlights })
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={highlight.title}
                            onChange={(e) => {
                              const highlights = editingProperty.highlights.map((h) =>
                                h.id === highlight.id ? { ...h, title: e.target.value } : h
                              )
                              setEditingProperty({ ...editingProperty, highlights })
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={highlight.description}
                            onChange={(e) => {
                              const highlights = editingProperty.highlights.map((h) =>
                                h.id === highlight.id ? { ...h, description: e.target.value } : h
                              )
                              setEditingProperty({ ...editingProperty, highlights })
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                  <Button onClick={addHighlight} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Highlight
                  </Button>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-4 mt-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Plus className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-amber-900">Add Category</h3>
                        <p className="text-sm text-amber-700 mb-3">
                          Category name (e.g., Essentials, Features)
                        </p>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Category name (e.g., Essentials, Features)"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="bg-white"
                          />
                          <Button onClick={handleAddCategory} disabled={!newCategoryName}>
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {propertyCategories.map((category) => (
                      <Card key={category.id} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="space-y-2 mb-4">
                          {category.amenities?.map((amenity: any) => (
                            <div
                              key={amenity.id}
                              className="flex items-center justify-between p-2 bg-background rounded"
                            >
                              <div className="flex items-center gap-2">
                                {amenity.icon && <span className="text-lg">{amenity.icon}</span>}
                                <span>{amenity.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAmenity(amenity.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex gap-2 items-end">
                            <div className="flex-1 space-y-2">
                              <Label className="text-sm">Amenity name</Label>
                              <Input
                                placeholder="Amenity name"
                                value={selectedCategory === category.id ? newAmenityName : ""}
                                onChange={(e) => {
                                  setNewAmenityName(e.target.value)
                                  setSelectedCategory(category.id)
                                }}
                                className="bg-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <EmojiPickerButton
                                value={selectedCategory === category.id ? newAmenityIcon : ""}
                                onChange={(emoji) => {
                                  setNewAmenityIcon(emoji)
                                  setSelectedCategory(category.id)
                                }}
                              />
                            </div>
                            <Button
                              onClick={handleAddAmenity}
                              disabled={
                                selectedCategory !== category.id ||
                                !newAmenityName ||
                                !newAmenityIcon
                              }
                            >
                              + Add
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="images" className="mt-4">
                  <PropertyImagesManager 
                    propertyId={editingProperty.id}
                    propertyName={editingProperty.title}
                  />
                </TabsContent>
              </Tabs>
            )}

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
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

        {/* Removed the featured limit warning dialog */}
      </div>
    </div>
  )
}
