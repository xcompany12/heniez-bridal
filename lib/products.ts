export const SILHOUETTES = ["A-Line", "Ball Gown", "Mermaid", "Sheath"] as const;
export const MATERIALS = ["Lace", "Silk", "Tulle"] as const;
export const COLLECTIONS = ["Spring 2026", "Classic Timeless"] as const;

export type ProductColor = { name: string; hex: string };

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
  /** Teks untuk bagian "Details and craftsmanship" di halaman detail */
  craftsmanship: string;
  colors: ProductColor[];
  /** Path di folder public/. Kosong = tampil penanda "Photo coming soon" */
  images: string[];
};

const IVORY: ProductColor = { name: "Ivory", hex: "#F3EBDD" };

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
    craftsmanship:
      "Lace appliques are placed by hand across the bodice and sleeves. A soft inner corset gives structure without stiffness.",
    colors: [IVORY, { name: "Champagne", hex: "#E6D3B3" }],
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
    craftsmanship:
      "The bodice is draped by hand in silk crepe. Lace sleeves detach, and a lace edge runs along the train.",
    colors: [{ name: "Soft white", hex: "#F7F5F0" }, IVORY],
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
    craftsmanship:
      "Multiple tulle layers are gathered onto a fitted bodice, with a built-in petticoat for volume.",
    colors: [IVORY],
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
    craftsmanship:
      "Cut on the bias for a smooth line, with a low back finished by a row of covered buttons.",
    colors: [IVORY],
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
    craftsmanship:
      "Layered tulle skirt with a sheer overlay, sewn to a lightly structured bodice.",
    colors: [IVORY, { name: "Blush", hex: "#F3D9D6" }],
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
    craftsmanship:
      "Lace is cut and aligned by hand so the pattern flows evenly from neckline to hem.",
    colors: [IVORY],
    images: [],
  },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

/** Gaun lain yang mirip: silhouette sama diutamakan, lalu collection sama. */
export async function getRelatedProducts(
  product: Product,
  limit = 3
): Promise<Product[]> {
  return products
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      p,
      score:
        (p.silhouette === product.silhouette ? 2 : 0) +
        (p.collection === product.collection ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.p.id - b.p.id)
    .slice(0, limit)
    .map((x) => x.p);
}

export function formatIDR(amount: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
}
