import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Klien untuk membaca data publik (gaun yang dipublikasikan) dengan publishable key.
 * Dibatasi oleh aturan RLS di database. fetch tanpa cache agar perubahan dari admin
 * langsung terlihat.
 */
export function getSupabasePublic(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
