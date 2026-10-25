import { getSupabasePublic } from "@/lib/supabase/public";
import type { Product, ProductColor } from "@/lib/product-types";

export * from "@/lib/product-types";

/** Satu baris tabel products di database. */
export type ProductRow = {
  id: number;
  slug: string;
  title: string;
  price: number;
  silhouette: Product["silhouette"];
  material: Product["material"];
  collection: Product["collection"];
  description: string;
  craftsmanship: string;
  colors: ProductColor[] | null;
  images: string[] | null;
  is_published: boolean;
  created_at: string;
};

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    price: Number(row.price),
    silhouette: row.silhouette,
    material: row.material,
    collection: row.collection,
    description: row.description,
    craftsmanship: row.craftsmanship,
    colors: Array.isArray(row.colors) ? row.colors : [],
    images: row.images ?? [],
  };
}

/** Gaun yang dipublikasikan, urutan "featured" = urutan dibuat. */
export async function getProducts(): Promise<Product[]> {
  const db = getSupabasePublic();
  if (!db) {
    console.error("Supabase environment variables are missing.");
    return [];
  }

  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Could not load products:", error.message);
    return [];
  }
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const db = getSupabasePublic();
  if (!db) return undefined;

  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Could not load product:", error.message);
    return undefined;
  }
  return data ? rowToProduct(data as ProductRow) : undefined;
}

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Gaun lain yang mirip: silhouette sama diutamakan, lalu collection sama. */
export async function getRelatedProducts(
  product: Product,
  limit = 3
): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      p,
      score:
        (same(p.silhouette, product.silhouette) ? 2 : 0) +
        (same(p.collection, product.collection) ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.p.id - b.p.id)
    .slice(0, limit)
    .map((x) => x.p);
}
