import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Simple Supabase client for API routes that don't need auth cookies
 * Use this for file uploads and other operations that don't require user context
 */
export function createSimpleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
