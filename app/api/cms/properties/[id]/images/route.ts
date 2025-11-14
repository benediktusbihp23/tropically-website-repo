import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  
  const { data: categories, error } = await supabase
    .from('image_categories')
    .select('*')
    .eq('property_id', params.id)
    .order('display_order', { ascending: true });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  // Fetch images for each category
  const categoriesWithImages = await Promise.all(
    (categories || []).map(async (cat) => {
      const { data: images } = await supabase
        .from('property_images')
        .select('*')
        .eq('category_id', cat.id)
        .order('display_order', { ascending: true });
      
      return {
        ...cat,
        property_images: images || []
      };
    })
  );
  
  return NextResponse.json({ categories: categoriesWithImages });
}
