import type { ProductRow } from "@/lib/products";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** Hanya dipanggil setelah requireAdmin() lolos. Termasuk gaun yang belum dipublikasikan. */
export async function getAdminProducts(): Promise<{
  rows: ProductRow[];
  failed: boolean;
}> {
  const db = getSupabaseAdmin();
  if (!db) return { rows: [], failed: true };

  const { data, error } = await db
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Could not load products:", error.message);
    return { rows: [], failed: true };
  }
  return { rows: (data ?? []) as ProductRow[], failed: false };
}

export async function getAdminProduct(id: number): Promise<ProductRow | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;

  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Could not load product:", error.message);
    return null;
  }
  return (data as ProductRow | null) ?? null;
}
