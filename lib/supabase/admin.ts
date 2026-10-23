import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Klien Supabase dengan secret key. HANYA dipanggil dari kode server
 * (Server Action, Route Handler). Jangan pernah diimpor di komponen "use client".
 * Mengembalikan null bila environment variable belum diisi.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
