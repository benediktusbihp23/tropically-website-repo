import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  const supabase = await createClient();
  const { name } = await request.json();
  
  const { data: maxOrderData } = await supabase
    .from('image_categories')
    .select('display_order')
    .eq('property_id', params.propertyId)
    .order('display_order', { ascending: false })
    .limit(1);
  
  const nextOrder = maxOrderData && maxOrderData.length > 0 
    ? maxOrderData[0].display_order + 1 
    : 0;
  
  const { data, error } = await supabase
    .from('image_categories')
    .insert({
      property_id: params.propertyId,
      name: name,
      display_order: nextOrder
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  return NextResponse.json(data);
}
