export const BRAND = {
  name: "Heniez Bridal",
  tagline: "Luxury bridal boutique",
};

export const NAV_ITEMS = [
  { label: "Collections", href: "/collections" },
  { label: "Appointments", href: "/appointments" },
  { label: "About us", href: "/about" },
] as const;

/**
 * Alamat situs untuk tag SEO, sitemap, dan data terstruktur.
 * Setelah memakai domain sendiri, isi NEXT_PUBLIC_SITE_URL di Vercel
 * (contoh: https://heniezbridal.com).
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
