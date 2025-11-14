import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  console.log('[UPLOAD] =========================');
  console.log('[UPLOAD] Starting upload process');
  console.log('[UPLOAD] Property ID:', params.propertyId);
  
  try {
    const contentType = request.headers.get('content-type');
    console.log('[UPLOAD] Content-Type:', contentType);
    
    if (!contentType?.includes('application/json')) {
      console.error('[UPLOAD] ERROR: Invalid content type');
      return NextResponse.json({ 
        error: 'Content-Type must be application/json with base64 image' 
      }, { status: 400 });
    }

    let body;
    try {
      body = await request.json();
      console.log('[UPLOAD] Body parsed successfully');
    } catch (parseError) {
      console.error('[UPLOAD] JSON parse error:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown error'
      }, { status: 400 });
    }
    
    const { image, category_id, filename } = body;
    
    if (!image || !category_id) {
      console.error('[UPLOAD] Missing required fields');
      return NextResponse.json({ 
        error: 'Missing required fields',
        received: { hasImage: !!image, hasCategoryId: !!category_id }
      }, { status: 400 });
    }
    
    console.log('[UPLOAD] Processing base64 image...');
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log('[UPLOAD] Buffer size:', buffer.length, 'bytes');
    
    if (buffer.length === 0) {
      console.error('[UPLOAD] Empty buffer');
      return NextResponse.json({ 
        error: 'Invalid image data' 
      }, { status: 400 });
    }
    
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const path = `${params.propertyId}/${timestamp}-${random}.webp`;
    
    console.log('[UPLOAD] Target path:', path);
    console.log('[UPLOAD] Uploading to Supabase using REST API...');
    
    // UPLOAD USING SUPABASE REST API DIRECTLY (bypasses SDK completely)
    const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/villa-images/${path}`;
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'image/webp',
        'Cache-Control': '3600',
      },
      body: buffer
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[UPLOAD] Storage upload failed:', errorText);
      return NextResponse.json({ 
        error: 'Failed to upload to storage',
        details: errorText
      }, { status: 500 });
    }
    
    const uploadData = await uploadResponse.json();
    console.log('[UPLOAD] ✅ Upload successful!');
    console.log('[UPLOAD] Storage response:', uploadData);
    
    // Get public URL
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/villa-images/${path}`;
    console.log('[UPLOAD] Public URL:', publicUrl);
    
    // Get next display order using REST API
    console.log('[UPLOAD] Calculating display order...');
    const orderUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_images?property_id=eq.${params.propertyId}&category_id=eq.${category_id}&order=display_order.desc&limit=1`;
    
    const orderResponse = await fetch(orderUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Content-Type': 'application/json',
      }
    });
    
    const orderData = await orderResponse.json();
    const nextOrder = (orderData[0]?.display_order ?? -1) + 1;
    console.log('[UPLOAD] Next display order:', nextOrder);
    
    // Insert into database using REST API
    console.log('[UPLOAD] Saving to database...');
    const insertUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_images`;
    
    const dbResponse = await fetch(insertUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        property_id: parseInt(params.propertyId),
        category_id: category_id,
        url: publicUrl,
        file_size: buffer.length,
        original_filename: filename || 'image.webp',
        display_order: nextOrder,
        is_featured: false
      })
    });
    
    if (!dbResponse.ok) {
      const errorText = await dbResponse.text();
      console.error('[UPLOAD] Database insert failed:', errorText);
      
      // Cleanup: Delete uploaded file
      console.log('[UPLOAD] Rolling back - deleting uploaded file...');
      await fetch(uploadUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        }
      });
      
      return NextResponse.json({ 
        error: 'Failed to save image metadata',
        details: errorText
      }, { status: 500 });
    }
    
    const dbData = await dbResponse.json();
    console.log('[UPLOAD] ✅ Database record created!');
    console.log('[UPLOAD] Image ID:', dbData[0]?.id);
    console.log('[UPLOAD] =========================');
    
    return NextResponse.json({ 
      success: true, 
      image: dbData[0],
      message: 'Image uploaded successfully'
    });
    
  } catch (error) {
    console.error('[UPLOAD] ❌ FATAL ERROR:', error);
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
