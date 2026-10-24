// Tipe dan konstanta gaun yang aman dipakai di server maupun browser.
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
  craftsmanship: string;
  colors: ProductColor[];
  /** URL foto atau path di folder public/. Kosong = penanda "Photo coming soon" */
  images: string[];
};

export function formatIDR(amount: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
}
