import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { image_id } = await request.json();
  
  // Unset all featured images for this property
  await supabase
    .from('property_images')
    .update({ is_featured: false })
    .eq('property_id', params.id);
  
  // Set the new featured image
  const { error } = await supabase
    .from('property_images')
    .update({ is_featured: true })
    .eq('id', image_id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  return NextResponse.json({ success: true });
}
