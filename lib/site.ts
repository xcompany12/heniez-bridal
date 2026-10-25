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

/**
 * KONTAK BUTIK. Isi tiga nilai ini, lalu muncul otomatis di footer,
 * halaman Appointments, dan halaman detail gaun. Yang dikosongkan tidak ditampilkan.
 */
export const CONTACT = {
  /** Nomor WhatsApp, boleh dengan spasi atau tanda +. Contoh: "+62 812 3456 7890" */
  whatsapp: "",
  /** Username Instagram atau tautan profil. Contoh: "heniezbridal" */
  instagram: "",
  /** Alamat email butik. Contoh: "hello@heniezbridal.com" */
  email: "",
};

/** Tautan WhatsApp dengan pesan awal. Nomor berawalan 0 dianggap nomor Indonesia (62). */
export function whatsappLink(message?: string): string | null {
  let digits = CONTACT.whatsapp.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function instagramHandle(): string | null {
  const raw = CONTACT.instagram.trim();
  if (!raw) return null;
  const fromUrl = raw.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
  const handle = (fromUrl ? fromUrl[1] : raw).replace(/^@/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(handle) ? handle : null;
}

export function instagramLink(): string | null {
  const handle = instagramHandle();
  return handle ? `https://instagram.com/${handle}` : null;
}

export function emailLink(subject?: string): string | null {
  const email = CONTACT.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}
