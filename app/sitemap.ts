import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { getSiteUrl } from "@/lib/site";

// Daftar gaun datang dari database, jadi dibuat setiap diminta.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const products = await getProducts();

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/collections`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/appointments`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
