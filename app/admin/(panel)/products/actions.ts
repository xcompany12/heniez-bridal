"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import {
  PRODUCT_BUCKET,
  validateProduct,
  type ProductFormState,
} from "@/lib/product-form";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Alamat file di Storage dari URL publiknya, atau null bila bukan dari bucket ini. */
function storagePathFromUrl(url: string): string | null {
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PRODUCT_BUCKET}/`;
  return url.startsWith(base) ? url.slice(base.length) : null;
}

async function removeStoredImages(urls: string[]) {
  const db = getSupabaseAdmin();
  if (!db) return;
  const paths = urls
    .map(storagePathFromUrl)
    .filter((p): p is string => Boolean(p));
  if (paths.length === 0) return;
  const { error } = await db.storage.from(PRODUCT_BUCKET).remove(paths);
  if (error) console.error("Could not remove old photos:", error.message);
}

/**
 * Tiket upload sekali pakai agar browser bisa mengirim foto langsung ke Storage.
 * Foto tidak lewat server kita, jadi tidak terbentur batas ukuran request.
 */
export async function getUploadTicket(
  contentType: string
): Promise<
  { path: string; token: string; publicUrl: string } | { error: string }
> {
  await requireAdmin();

  const ext = EXTENSIONS[contentType];
  if (!ext) return { error: "Only JPG, PNG, or WebP photos are allowed." };

  const db = getSupabaseAdmin();
  if (!db) return { error: "Storage is not configured." };

  const path = `gowns/${randomUUID()}.${ext}`;
  const { data, error } = await db.storage
    .from(PRODUCT_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("Could not create upload ticket:", error?.message);
    return { error: "Could not start the upload. Try again." };
  }

  const { data: pub } = db.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
  return { path, token: data.token, publicUrl: pub.publicUrl };
}

export async function saveProduct(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const raw: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") raw[key] = value;
  });

  const idText = (raw.id ?? "").trim();
  const id = idText ? Number(idText) : null;
  if (idText && !Number.isInteger(id)) {
    return { status: "error", message: "Invalid gown.", values: raw };
  }

  const { input, errors } = validateProduct(raw);
  if (!input) {
    return {
      status: "error",
      message: "Please check the fields marked below.",
      errors,
      values: raw,
    };
  }

  const db = getSupabaseAdmin();
  if (!db) {
    return {
      status: "error",
      message: "The database is not configured.",
      values: raw,
    };
  }

  // Samakan ejaan silhouette, material, dan collection dengan gaun lain
  // (mis. "lace" menjadi "Lace") agar filter di situs tidak terpecah.
  let existingQuery = db.from("products").select("silhouette, material, collection");
  if (id !== null) existingQuery = existingQuery.neq("id", id);
  const { data: existing } = await existingQuery;
  const canonical = (key: "silhouette" | "material" | "collection", value: string) => {
    const match = (existing ?? [])
      .map((row) => String(row[key] ?? "").trim())
      .find((label) => label.toLowerCase() === value.toLowerCase());
    return match || value;
  };
  input.silhouette = canonical("silhouette", input.silhouette);
  input.material = canonical("material", input.material);
  input.collection = canonical("collection", input.collection);

  let previousImages: string[] = [];
  if (id !== null) {
    const { data } = await db
      .from("products")
      .select("images")
      .eq("id", id)
      .maybeSingle();
    previousImages = (data?.images as string[] | null) ?? [];
  }

  const { error } =
    id !== null
      ? await db.from("products").update(input).eq("id", id)
      : await db.from("products").insert(input);

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        message: "Please check the fields marked below.",
        errors: { slug: "This URL name is already used. Choose another." },
        values: raw,
      };
    }
    console.error("Could not save product:", error.message);
    return {
      status: "error",
      message: "Could not save the gown. Please try again.",
      values: raw,
    };
  }

  // Hapus foto lama yang sudah tidak dipakai (hanya yang tersimpan di Storage).
  await removeStoredImages(previousImages.filter((u) => !input.images.includes(u)));

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const db = getSupabaseAdmin();
  if (!db) return;

  const { data: row } = await db
    .from("products")
    .select("images")
    .eq("id", id)
    .maybeSingle();

  const { error } = await db.from("products").delete().eq("id", id);
  if (error) {
    console.error("Could not delete product:", error.message);
    return;
  }

  await removeStoredImages((row?.images as string[] | null) ?? []);

  revalidatePath("/", "layout");
  redirect("/admin/products");
}
