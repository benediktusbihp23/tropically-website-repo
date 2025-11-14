'use client';

import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { convertToWebP } from '@/lib/image-utils';
import Image from 'next/image';

interface PropertyImagesManagerProps {
  propertyId: string;
  propertyName: string;
}

export default function PropertyImagesManager({ 
  propertyId, 
  propertyName 
}: PropertyImagesManagerProps) {
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [previewImages, setPreviewImages] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    fetchImages();
  }, [propertyId]);
  
  async function fetchImages() {
    const res = await fetch(`/api/cms/properties/${propertyId}/images`);
    const data = await res.json();
    setCategories(data.categories || []);
  }
  
  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !selectedCategory) {
      alert('Please select a category first');
      return;
    }
    
    await uploadFiles(Array.from(files));
    e.target.value = '';
  }
  
  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      await uploadFiles(files);
    }
  }
  
  async function uploadFiles(files: File[]) {
    setUploading(true);
    
    try {
      console.log('[v0] Starting upload for', files.length, 'files using base64');
      
      let successCount = 0;
      
      for (const file of files) {
        const fileId = `${file.name}-${Date.now()}`;
        
        try {
          setUploadProgress(prev => ({ ...prev, [fileId]: 10 }));
          
          // Show preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviewImages(prev => ({ 
              ...prev, 
              [fileId]: e.target?.result as string 
            }));
          };
          reader.readAsDataURL(file);
          
          // Convert to WebP
          setUploadProgress(prev => ({ ...prev, [fileId]: 30 }));
          console.log('[v0] Converting', file.name, 'to WebP...');
          
          const webpBlob = await convertToWebP(file);
          
          setUploadProgress(prev => ({ ...prev, [fileId]: 50 }));
          
          // Convert to base64
          const base64Promise = new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(webpBlob);
          });
          
          const base64 = await base64Promise;
          
          setUploadProgress(prev => ({ ...prev, [fileId]: 70 }));
          console.log('[v0] Converted to base64, sending to server...');
          
          // Send as JSON
          const response = await fetch(
            `/api/cms/properties/${propertyId}/images/upload`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                image: base64,
                category_id: selectedCategory,
                filename: file.name
              })
            }
          );
          
          setUploadProgress(prev => ({ ...prev, [fileId]: 90 }));
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
          }
          
          const data = await response.json();
          console.log('[v0] Upload successful:', data.image.original_filename);
          
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          successCount++;
          
        } catch (error) {
          console.error('[v0] Error uploading', file.name, ':', error);
          alert(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      // Refresh images
      await fetchImages();
      setUploadProgress({});
      setPreviewImages({});
      
      if (successCount > 0) {
        alert(`Successfully uploaded ${successCount} image(s)!`);
      }
      
    } catch (error) {
      console.error('[v0] Upload error:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
    }
  }
  
  
  async function handleAddCategory(name: string) {
    const res = await fetch(`/api/cms/properties/${propertyId}/image-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    
    if (res.ok) {
      await fetchImages();
    }
  }
  
  async function handleDeleteImage(imageId: string, imageUrl: string) {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    
    await fetch(`/api/cms/properties/${propertyId}/images/${imageId}`, {
      method: 'DELETE'
    });
    
    await fetchImages();
  }
  
  async function handleSetFeatured(imageId: string) {
    await fetch(`/api/cms/properties/${propertyId}/images/featured`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_id: imageId })
    });
    
    await fetchImages();
  }
  
  async function handleReorder(categoryId: string, result: any) {
    if (!result.destination) return;
    
    const category = categories.find((c: any) => c.id === categoryId);
    const images = Array.from(category.property_images);
    const [removed] = images.splice(result.source.index, 1);
    images.splice(result.destination.index, 0, removed);
    
    const updatedImages = images.map((img: any, index) => ({
      id: img.id,
      display_order: index
    }));
    
    await fetch(`/api/cms/properties/${propertyId}/images/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: updatedImages })
    });
    
    await fetchImages();
  }
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
      {/* Upload Section */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-dashed border-amber-300">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          📤 Upload Images
        </h3>
        
        <div className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">
              1. Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
            >
              <option value="">Choose a category...</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.property_images?.length || 0} images)
                </option>
              ))}
            </select>
          </div>
          
          {/* Drag-Drop Zone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              2. Upload Images (will be converted to WebP)
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-3 border-dashed rounded-xl p-12 text-center cursor-pointer
                transition-all duration-200
                ${selectedCategory 
                  ? 'border-green-700 bg-green-50 hover:bg-green-100' 
                  : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
                }
              `}
            >
              <div className="space-y-3">
                <div className="text-6xl">🖼️</div>
                <div>
                  <p className="text-lg font-semibold">
                    {selectedCategory 
                      ? 'Drop images here or click to browse' 
                      : 'Please select a category first'
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports: JPG, PNG, HEIC • Will convert to WebP automatically
                  </p>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={!selectedCategory || uploading}
                className="hidden"
              />
            </div>
          </div>
          
          {/* Upload Progress */}
          {uploading && (
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Uploading... (Base64 method)</h4>
              <div className="space-y-2">
                {Object.entries(uploadProgress).map(([fileId, progress]) => (
                  <div key={fileId} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="truncate flex-1">{fileId.split('-')[0]}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-700 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      
      {/* Add Category */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold mb-3">➕ Add New Category</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Category name (e.g., Living Room, Pool)"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                handleAddCategory(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder*="Category name"]') as HTMLInputElement;
              if (input?.value) {
                handleAddCategory(input.value);
                input.value = '';
              }
            }}
            className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-semibold"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Image Categories */}
      {categories.map((category: any) => (
        <div key={category.id} className="bg-white border-2 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl">
              📁 {category.name}
              <span className="text-gray-500 text-base ml-2">
                ({category.property_images?.length || 0})
              </span>
            </h3>
          </div>
          
          {category.property_images && category.property_images.length > 0 ? (
            <DragDropContext onDragEnd={(result) => handleReorder(category.id, result)}>
              <Droppable droppableId={category.id} direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  >
                    {category.property_images.map((image: any, index: number) => (
                      <Draggable key={image.id} draggableId={image.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              border-2 rounded-lg overflow-hidden bg-white
                              transition-shadow
                              ${snapshot.isDragging ? 'shadow-2xl border-green-700' : 'shadow hover:shadow-lg'}
                            `}
                          >
                            <div className="relative aspect-[4/3] bg-gray-100">
                              <Image
                                src={image.url || "/placeholder.svg"}
                                alt={image.original_filename}
                                fill
                                className="object-cover"
                              />
                              
                              {image.is_featured && (
                                <div className="absolute top-2 left-2 bg-yellow-400 text-black px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                                  ⭐ FEATURED
                                </div>
                              )}
                              
                              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
                                ⋮⋮ Drag
                              </div>
                            </div>
                            
                            <div className="p-3 space-y-2">
                              <p className="text-xs text-gray-500 truncate" title={image.original_filename}>
                                📄 {image.original_filename}
                              </p>
                              
                              <div className="flex gap-2">
                                {!image.is_featured && (
                                  <button
                                    onClick={() => handleSetFeatured(image.id)}
                                    className="flex-1 text-xs px-3 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 font-semibold"
                                  >
                                    ⭐ Set Featured
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteImage(image.id, image.url)}
                                  className="text-xs px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 font-semibold"
                                  title="Delete image"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-400 text-lg">📭 No images in this category</p>
              <p className="text-gray-400 text-sm mt-1">Upload images above to get started</p>
            </div>
          )}
        </div>
      ))}
      
      {categories.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
          <div className="text-6xl mb-4">🏖️</div>
          <p className="text-gray-500 text-lg font-semibold">No categories yet</p>
          <p className="text-gray-400 text-sm mt-2">Add a category above to organize your images</p>
        </div>
      )}
    </div>
  );
}
