import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  console.log('[UPLOAD] =========================');
  console.log('[UPLOAD] Starting upload process');
  console.log('[UPLOAD] Property ID:', params.propertyId);
  
  try {
    // Validate content type
    const contentType = request.headers.get('content-type');
    console.log('[UPLOAD] Content-Type:', contentType);
    
    if (!contentType?.includes('application/json')) {
      console.error('[UPLOAD] ERROR: Invalid content type');
      return NextResponse.json({ 
        error: 'Content-Type must be application/json with base64 image' 
      }, { status: 400 });
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('[UPLOAD] Body parsed successfully');
      console.log('[UPLOAD] Has image:', !!body.image);
      console.log('[UPLOAD] Has category_id:', !!body.category_id);
      console.log('[UPLOAD] Filename:', body.filename);
    } catch (parseError) {
      console.error('[UPLOAD] JSON parse error:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown error'
      }, { status: 400 });
    }
    
    const { image, category_id, filename } = body;
    
    // Validate required fields
    if (!image || !category_id) {
      console.error('[UPLOAD] Missing required fields');
      return NextResponse.json({ 
        error: 'Missing required fields',
        received: { hasImage: !!image, hasCategoryId: !!category_id }
      }, { status: 400 });
    }
    
    // Initialize Supabase
    const supabase = await createClient();
    console.log('[UPLOAD] Supabase client created');
    
    // Process base64 image
    console.log('[UPLOAD] Processing base64 image...');
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const uint8Array = new Uint8Array(buffer);
    
    console.log('[UPLOAD] Buffer size:', uint8Array.length, 'bytes');
    console.log('[UPLOAD] Buffer size (KB):', (uint8Array.length / 1024).toFixed(2));
    
    if (uint8Array.length === 0) {
      console.error('[UPLOAD] Empty buffer after base64 conversion');
      return NextResponse.json({ 
        error: 'Invalid image data - resulted in empty buffer' 
      }, { status: 400 });
    }
    
    // Generate unique file path
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const path = `${params.propertyId}/${timestamp}-${random}.webp`;
    
    console.log('[UPLOAD] Target path:', path);
    console.log('[UPLOAD] Uploading to Supabase storage...');
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('villa-images')
      .upload(path, uint8Array, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('[UPLOAD] Storage upload failed:', uploadError);
      return NextResponse.json({ 
        error: 'Failed to upload to storage',
        details: uploadError.message,
        code: uploadError.name
      }, { status: 500 });
    }
    
    console.log('[UPLOAD] ✅ Upload successful!');
    console.log('[UPLOAD] Storage path:', uploadData.path);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('villa-images')
      .getPublicUrl(path);
    
    console.log('[UPLOAD] Public URL generated:', urlData.publicUrl);
    
    // Get next display order
    console.log('[UPLOAD] Calculating display order...');
    const { data: maxOrderData } = await supabase
      .from('property_images')
      .select('display_order')
      .eq('property_id', parseInt(params.propertyId))
      .eq('category_id', category_id)
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    const nextOrder = (maxOrderData?.display_order ?? -1) + 1;
    console.log('[UPLOAD] Next display order:', nextOrder);
    
    // Insert into database
    console.log('[UPLOAD] Saving to database...');
    const { data: dbData, error: dbError } = await supabase
      .from('property_images')
      .insert({
        property_id: parseInt(params.propertyId),
        category_id: category_id,
        url: urlData.publicUrl,
        file_size: uint8Array.length,
        original_filename: filename || 'image.webp',
        display_order: nextOrder,
        is_featured: false
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('[UPLOAD] Database insert failed:', dbError);
      
      // Cleanup: Delete uploaded file
      console.log('[UPLOAD] Rolling back - deleting uploaded file...');
      await supabase.storage
        .from('villa-images')
        .remove([path]);
      
      return NextResponse.json({ 
        error: 'Failed to save image metadata to database',
        details: dbError.message,
        code: dbError.code
      }, { status: 500 });
    }
    
    console.log('[UPLOAD] ✅ Database record created!');
    console.log('[UPLOAD] Image ID:', dbData.id);
    console.log('[UPLOAD] =========================');
    
    return NextResponse.json({ 
      success: true, 
      image: dbData,
      message: 'Image uploaded successfully'
    });
    
  } catch (error) {
    console.error('[UPLOAD] ❌ FATAL ERROR:', error);
    console.error('[UPLOAD] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[UPLOAD] Error message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('[UPLOAD] Stack trace:', error.stack);
    }
    console.log('[UPLOAD] =========================');
    
    return NextResponse.json({ 
      error: 'Upload failed with fatal error',
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error
    }, { status: 500 });
  }
}
