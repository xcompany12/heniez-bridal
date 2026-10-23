export const SILHOUETTES = ["A-Line", "Ball Gown", "Mermaid", "Sheath"] as const;
export const MATERIALS = ["Lace", "Silk", "Tulle"] as const;
export const COLLECTIONS = ["Spring 2026", "Classic Timeless"] as const;

export type Product = {
  id: number;
  slug: string;
  title: string;
  /** Harga dalam Rupiah */
  price: number;
  silhouette: (typeof SILHOUETTES)[number];
  material: (typeof MATERIALS)[number];
  collection: (typeof COLLECTIONS)[number];
  description: string;
  /** Path di folder public/. Kosong = tampil penanda "Photo coming soon" */
  images: string[];
};

/**
 * DATA CONTOH. Nama, harga, dan deskripsi di bawah adalah placeholder
 * untuk portfolio. Ganti dengan data asli.
 * Di Tahap 6 data ini dipindah ke database (Supabase); fungsi
 * getProducts() dan getProductBySlug() tetap sama, jadi halaman tidak berubah.
 */
export const products: Product[] = [
  {
    id: 1,
    slug: "josephine",
    title: "Josephine",
    price: 28500000,
    silhouette: "A-Line",
    material: "Lace",
    collection: "Classic Timeless",
    description:
      "A fitted bodice in hand-applied lace opens into a soft A-line skirt with a long, sweeping veil.",
    images: ["/images/products/josephine.jpg"],
  },
  {
    id: 2,
    slug: "seraphina",
    title: "Seraphina",
    price: 24000000,
    silhouette: "Mermaid",
    material: "Silk",
    collection: "Spring 2026",
    description:
      "A draped crepe mermaid with a strapless neckline and detachable lace sleeves.",
    images: ["/images/products/seraphina.jpg"],
  },
  {
    id: 3,
    slug: "aurelia",
    title: "Aurelia",
    price: 32000000,
    silhouette: "Ball Gown",
    material: "Tulle",
    collection: "Classic Timeless",
    description: "Layers of soft tulle build a full skirt with a cathedral train.",
    images: [],
  },
  {
    id: 4,
    slug: "celeste",
    title: "Celeste",
    price: 18500000,
    silhouette: "Sheath",
    material: "Silk",
    collection: "Spring 2026",
    description: "A clean, close-fitting silk column with a low back.",
    images: [],
  },
  {
    id: 5,
    slug: "marguerite",
    title: "Marguerite",
    price: 21000000,
    silhouette: "A-Line",
    material: "Tulle",
    collection: "Spring 2026",
    description: "A light A-line in layered tulle, finished with a sheer overlay.",
    images: [],
  },
  {
    id: 6,
    slug: "isolde",
    title: "Isolde",
    price: 26800000,
    silhouette: "Mermaid",
    material: "Lace",
    collection: "Classic Timeless",
    description: "Lace from neckline to hem, fitted through the hip and flared at the knee.",
    images: [],
  },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export function formatIDR(amount: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
}
