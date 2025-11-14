import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { propertyId: string; imageId: string } }
) {
  const supabase = await createClient();
  
  const { data: image } = await supabase
    .from('property_images')
    .select('url')
    .eq('id', params.imageId)
    .single();
  
  if (!image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
  
  // Extract filename from URL
  const urlParts = image.url.split('/');
  const filename = urlParts.slice(-2).join('/'); // propertyId/filename.webp
  
  // Delete from storage
  await supabase.storage
    .from('villa-images')
    .remove([filename]);
  
  // Delete from database
  const { error } = await supabase
    .from('property_images')
    .delete()
    .eq('id', params.imageId);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  return NextResponse.json({ success: true });
}
