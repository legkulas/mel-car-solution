/**
 * Supabase Client Configuration & Initialization Module
 * Provides typed database access for browser sessions and server-side operations.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const configuredSupabaseEndpointUrl: string =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://placeholder.supabase.co';

const configuredSupabaseAnonymousKey: string =
  (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.includes('your-anon-key'))
    ? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
       !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-anon-key'))
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : 'placeholder-anon-key';

/**
 * Standard browser-accessible Supabase client instance.
 * Operations executed through this client are restricted by PostgreSQL Row Level Security (RLS).
 */
export const supabasePublicClient: SupabaseClient = createClient(
  configuredSupabaseEndpointUrl,
  configuredSupabaseAnonymousKey
);

/**
 * Creates and returns an administrative Supabase client instance for server-side operations.
 * Used exclusively within Server Actions and Route Handlers for elevated execution.
 */
export function getSupabaseServerAdministrativeClient(): SupabaseClient {
  const administrativeServiceRoleKey: string =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder-service-key';

  return createClient(configuredSupabaseEndpointUrl, administrativeServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
