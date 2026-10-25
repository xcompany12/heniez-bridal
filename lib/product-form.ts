import type { ProductColor } from "@/lib/product-types";

export const PRODUCT_BUCKET = "product-images";
/** Batas pengaman saja (halaman admin tidak dimaksudkan mencapainya). */
export const MAX_IMAGES = 50;
/** Foto asli yang dipilih boleh sebesar ini; foto besar diperkecil di browser sebelum diunggah. */
export const MAX_ORIGINAL_BYTES = 80 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Pengaturan pengecilan foto di browser (lihat lib/image-resize.ts). */
export const UPLOAD_MAX_EDGE = 2400;
export const UPLOAD_QUALITY = 0.9;
export const RESIZE_THRESHOLD_BYTES = 1.5 * 1024 * 1024;

export type ProductField =
  | "title"
  | "slug"
  | "price"
  | "silhouette"
  | "material"
  | "collection"
  | "description"
  | "craftsmanship"
  | "colors"
  | "images";

export type ProductFormState = {
  status: "idle" | "error";
  message?: string;
  errors?: Partial<Record<ProductField, string>>;
  /** Isian mentah, dikembalikan agar form tidak kosong saat ada error */
  values?: Record<string, string>;
};

export const INITIAL_PRODUCT_STATE: ProductFormState = { status: "idle" };

export type ProductInput = {
  title: string;
  slug: string;
  price: number;
  silhouette: string;
  material: string;
  collection: string;
  description: string;
  craftsmanship: string;
  colors: ProductColor[];
  images: string[];
  is_published: boolean;
};

/** Rapikan spasi ganda dan spasi di tepi. */
function cleanLabel(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function colorsToText(colors: ProductColor[]): string {
  return colors.map((c) => `${c.name}, ${c.hex}`).join("\n");
}

export function parseColors(text: string): {
  colors: ProductColor[];
  error?: string;
} {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return { colors: [{ name: "Ivory", hex: "#F3EBDD" }] };
  if (lines.length > 8) return { colors: [], error: "Use at most 8 colors." };

  const colors: ProductColor[] = [];
  for (const line of lines) {
    const m = line.match(/^(.{1,30}?)\s*[,;]\s*(#[0-9a-fA-F]{6})$/);
    if (!m) {
      return {
        colors: [],
        error: `Write each color as "Name, #RRGGBB". Problem line: ${line}`,
      };
    }
    colors.push({ name: m[1].trim(), hex: m[2].toUpperCase() });
  }
  return { colors };
}

function isAllowedImageUrl(url: string): boolean {
  if (url.includes("..")) return false;
  if (url.startsWith("/images/products/")) return true;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return (
    Boolean(base) &&
    url.startsWith(`${base}/storage/v1/object/public/${PRODUCT_BUCKET}/`)
  );
}

export function validateProduct(raw: Record<string, string>): {
  input: ProductInput | null;
  errors: Partial<Record<ProductField, string>>;
} {
  const errors: Partial<Record<ProductField, string>> = {};

  const title = (raw.title ?? "").trim();
  if (title.length < 2 || title.length > 80) {
    errors.title = "Enter a name between 2 and 80 characters.";
  }

  const slug = (raw.slug ?? "").trim() || slugify(title);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 60) {
    errors.slug = "Use lowercase letters, numbers, and single hyphens only.";
  }

  const priceDigits = (raw.price ?? "").replace(/[^\d]/g, "");
  const price = Number(priceDigits);
  if (priceDigits.length === 0 || priceDigits.length > 10 || !Number.isFinite(price)) {
    errors.price = "Enter the price in Rupiah, numbers only.";
  }

  const silhouette = cleanLabel(raw.silhouette);
  if (silhouette.length < 1 || silhouette.length > 40) {
    errors.silhouette = "Enter a silhouette (up to 40 characters).";
  }
  const material = cleanLabel(raw.material);
  if (material.length < 1 || material.length > 40) {
    errors.material = "Enter a material (up to 40 characters).";
  }
  const collection = cleanLabel(raw.collection);
  if (collection.length < 1 || collection.length > 40) {
    errors.collection = "Enter a collection (up to 40 characters).";
  }

  const description = (raw.description ?? "").trim();
  if (description.length > 600) {
    errors.description = "Keep the description under 600 characters.";
  }
  const craftsmanship = (raw.craftsmanship ?? "").trim();
  if (craftsmanship.length > 600) {
    errors.craftsmanship = "Keep this under 600 characters.";
  }

  const parsedColors = parseColors(raw.colors ?? "");
  if (parsedColors.error) errors.colors = parsedColors.error;

  let images: string[] = [];
  try {
    const parsed: unknown = JSON.parse(raw.images || "[]");
    if (
      !Array.isArray(parsed) ||
      !parsed.every((u): u is string => typeof u === "string")
    ) {
      throw new Error("bad images");
    }
    images = parsed;
  } catch {
    errors.images = "The photo list is invalid. Reload the page and try again.";
  }
  if (images.length > MAX_IMAGES) {
    errors.images = `Use at most ${MAX_IMAGES} photos.`;
  } else if (!images.every(isAllowedImageUrl)) {
    errors.images = "One of the photos is not from this site's storage.";
  }

  if (Object.keys(errors).length > 0) return { input: null, errors };

  return {
    input: {
      title,
      slug,
      price,
      silhouette,
      material,
      collection,
      description,
      craftsmanship,
      colors: parsedColors.colors,
      images,
      is_published: raw.is_published === "on",
    },
    errors,
  };
}
