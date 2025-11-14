import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    const supabase = await createClient();
    
    
    const body = await request.json();
    const { image, category_id, filename } = body;
    
    if (!image || !category_id) {
      return NextResponse.json({ error: 'Missing image or category' }, { status: 400 });
    }
    
    console.log('[UPLOAD] Starting upload');
    
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const uint8Array = new Uint8Array(buffer);
    
    console.log('[UPLOAD] Buffer size:', uint8Array.length);
    
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const path = `${params.propertyId}/${timestamp}-${random}.webp`;
    
    console.log('[UPLOAD] Uploading to:', path);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('villa-images')
      .upload(path, uint8Array, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('[UPLOAD] Upload error:', uploadError);
      return NextResponse.json({ 
        error: uploadError.message,
        details: uploadError 
      }, { status: 500 });
    }
    
    console.log('[UPLOAD] Upload successful:', uploadData.path);
    
    const { data: urlData } = supabase.storage
      .from('villa-images')
      .getPublicUrl(path);
    
    console.log('[UPLOAD] Public URL:', urlData.publicUrl);
    
    const { data: maxOrderData } = await supabase
      .from('property_images')
      .select('display_order')
      .eq('property_id', parseInt(params.propertyId))
      .eq('category_id', category_id)
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    const nextOrder = (maxOrderData?.display_order ?? -1) + 1;
    
    const { data: dbData, error: dbError } = await supabase
      .from('property_images')
      .insert({
        property_id: parseInt(params.propertyId),
        category_id: category_id,
        url: urlData.publicUrl,
        file_size: uint8Array.length,
        original_filename: filename,
        display_order: nextOrder,
        is_featured: false
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('[UPLOAD] Database error:', dbError);
      
      await supabase.storage
        .from('villa-images')
        .remove([path]);
      
      return NextResponse.json({ 
        error: 'Failed to save image metadata',
        details: dbError 
      }, { status: 500 });
    }
    
    console.log('[UPLOAD] Saved to database:', dbData.id);
    
    return NextResponse.json({ success: true, image: dbData });
    
  } catch (error) {
    console.error('[UPLOAD] Fatal error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
