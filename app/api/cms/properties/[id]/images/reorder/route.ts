import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { images } = await request.json();
  
  for (const img of images) {
    await supabase
      .from('property_images')
      .update({ display_order: img.display_order })
      .eq('id', img.id);
  }
  
  return NextResponse.json({ success: true });
}
