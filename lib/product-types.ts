// Tipe dan fungsi gaun yang aman dipakai di server maupun browser.

export type ProductColor = { name: string; hex: string };

export type Product = {
  id: number;
  slug: string;
  title: string;
  /** Harga dalam Rupiah */
  price: number;
  /** Teks bebas yang diisi pemilik di admin */
  silhouette: string;
  material: string;
  collection: string;
  description: string;
  craftsmanship: string;
  colors: ProductColor[];
  /** URL foto atau path di folder public/. Kosong = penanda "Photo coming soon" */
  images: string[];
};

export function formatIDR(amount: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
}

/** Nilai unik tanpa membedakan huruf besar atau kecil, urut abjad. */
export function uniqueLabels(values: string[]): string[] {
  const seen = new Map<string, string>();
  for (const value of values) {
    const label = value.trim();
    const key = label.toLowerCase();
    if (key && !seen.has(key)) seen.set(key, label);
  }
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
}
