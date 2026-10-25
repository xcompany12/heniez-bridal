"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { getUploadTicket, saveProduct } from "@/app/admin/(panel)/products/actions";
import { prepareForUpload } from "@/lib/image-resize";
import {
  ALLOWED_IMAGE_TYPES,
  INITIAL_PRODUCT_STATE,
  MAX_IMAGES,
  MAX_ORIGINAL_BYTES,
  PRODUCT_BUCKET,
  UPLOAD_MAX_EDGE,
  colorsToText,
  type ProductField,
} from "@/lib/product-form";
import type { ProductColor } from "@/lib/product-types";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

type EditableProduct = {
  id: number;
  slug: string;
  title: string;
  price: number;
  silhouette: string;
  material: string;
  collection: string;
  description: string;
  craftsmanship: string;
  colors: ProductColor[] | null;
  images: string[] | null;
  is_published: boolean;
};

type Suggestions = {
  silhouette: string[];
  material: string[];
  collection: string[];
};

const inputClass = "w-full border border-line bg-white/60 px-4 py-3 text-sm";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn-dark disabled:opacity-60"
    >
      {pending ? "Saving..." : disabled ? "Uploading..." : "Save gown"}
    </button>
  );
}

export default function ProductForm({
  product,
  suggestions,
}: {
  product?: EditableProduct;
  suggestions: Suggestions;
}) {
  const [state, formAction] = useFormState(saveProduct, INITIAL_PRODUCT_STATE);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const v = state.values;
  const errors = state.errors ?? {};

  const text = (name: string, fallback: string) => v?.[name] ?? fallback;

  const published = v
    ? v.is_published === "on"
    : product
      ? product.is_published
      : true;

  const FieldError = ({ name }: { name: ProductField }) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-2 text-sm text-red-700">
        {errors[name]}
      </p>
    ) : null;

  const describe = (name: ProductField) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadErrors([]);
    setUploading(true);

    const list = Array.from(files);
    const problems: string[] = [];
    let count = images.length;

    for (let i = 0; i < list.length; i++) {
      const original = list[i];
      setProgress(`Uploading photo ${i + 1} of ${list.length}`);

      if (count >= MAX_IMAGES) {
        problems.push(`A gown can have up to ${MAX_IMAGES} photos.`);
        break;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(original.type)) {
        problems.push(
          `${original.name}: only JPG, PNG, or WebP photos are supported. Export HEIC photos as JPG first.`
        );
        continue;
      }
      if (original.size > MAX_ORIGINAL_BYTES) {
        problems.push(`${original.name}: the file is larger than 80 MB.`);
        continue;
      }

      // Foto besar dari kamera profesional diperkecil dulu agar cepat dan hemat tempat.
      const file = await prepareForUpload(original);

      const ticket = await getUploadTicket(file.type);
      if ("error" in ticket) {
        problems.push(`${original.name}: ${ticket.error}`);
        continue;
      }

      const { error } = await getSupabaseBrowser()
        .storage.from(PRODUCT_BUCKET)
        .uploadToSignedUrl(ticket.path, ticket.token, file, {
          contentType: file.type,
        });
      if (error) {
        problems.push(`${original.name}: the upload failed. Try again.`);
        continue;
      }

      count += 1;
      setImages((prev) => [...prev, ticket.publicUrl]);
    }

    setProgress(null);
    setUploading(false);
    setUploadErrors(problems);
  }

  const makeMain = (index: number) =>
    setImages((prev) => [prev[index], ...prev.filter((_, i) => i !== index)]);
  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  return (
    <form action={formAction} className="max-w-2xl space-y-8" noValidate>
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div>
        <label htmlFor="title" className="mb-2 block text-sm">
          Name
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={inputClass}
          defaultValue={text("title", product?.title ?? "")}
          {...describe("title")}
        />
        <FieldError name="title" />
      </div>

      <div>
        <label htmlFor="slug" className="mb-2 block text-sm">
          URL name
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          className={inputClass}
          placeholder="Filled in from the name if left empty"
          defaultValue={text("slug", product?.slug ?? "")}
          {...describe("slug")}
        />
        <p className="mt-2 text-xs text-muted">
          The gown page address, for example /products/josephine. Changing it
          breaks old links to this gown.
        </p>
        <FieldError name="slug" />
      </div>

      <div>
        <label htmlFor="price" className="mb-2 block text-sm">
          Price (Rupiah)
        </label>
        <input
          id="price"
          name="price"
          type="text"
          inputMode="numeric"
          className={inputClass}
          placeholder="28500000"
          defaultValue={text("price", product ? String(product.price) : "")}
          {...describe("price")}
        />
        <FieldError name="price" />
      </div>

      <div>
        <div className="grid gap-6 md:grid-cols-3">
          {(
            [
              ["silhouette", "Silhouette", "e.g. Mermaid", product?.silhouette],
              ["material", "Material", "e.g. Lace", product?.material],
              ["collection", "Collection", "e.g. Spring 2026", product?.collection],
            ] as const
          ).map(([name, label, placeholder, current]) => (
            <div key={name}>
              <label htmlFor={name} className="mb-2 block text-sm">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type="text"
                list={`${name}-options`}
                autoComplete="off"
                className={inputClass}
                placeholder={placeholder}
                defaultValue={text(name, current ?? "")}
                {...describe(name)}
              />
              <datalist id={`${name}-options`}>
                {suggestions[name].map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
              <FieldError name={name} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          Type anything you like. Suggestions come from your other gowns; using
          the same wording keeps the filters on the site tidy.
        </p>
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-sm">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className={inputClass}
          defaultValue={text("description", product?.description ?? "")}
          {...describe("description")}
        />
        <FieldError name="description" />
      </div>

      <div>
        <label htmlFor="craftsmanship" className="mb-2 block text-sm">
          Details and craftsmanship
        </label>
        <textarea
          id="craftsmanship"
          name="craftsmanship"
          rows={3}
          className={inputClass}
          defaultValue={text("craftsmanship", product?.craftsmanship ?? "")}
          {...describe("craftsmanship")}
        />
        <FieldError name="craftsmanship" />
      </div>

      <div>
        <label htmlFor="colors" className="mb-2 block text-sm">
          Colors
        </label>
        <textarea
          id="colors"
          name="colors"
          rows={3}
          className={`${inputClass} font-mono`}
          defaultValue={text(
            "colors",
            product?.colors?.length
              ? colorsToText(product.colors)
              : "Ivory, #F3EBDD"
          )}
          {...describe("colors")}
        />
        <p className="mt-2 text-xs text-muted">
          One color per line, written as Name, #RRGGBB.
        </p>
        <FieldError name="colors" />
      </div>

      <div>
        <p className="mb-2 text-sm">Photos</p>
        {images.length > 0 && (
          <ul className="mb-4 grid grid-cols-3 gap-4 md:grid-cols-5">
            {images.map((src, i) => (
              <li key={src}>
                <div className="relative aspect-[2/3] overflow-hidden bg-line/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Photo ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute left-0 top-0 bg-ink px-2 py-1 text-xs text-ivory">
                      Main
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-col items-start gap-1 text-xs">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeMain(i)}
                      className="underline underline-offset-4"
                    >
                      Make main
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="text-red-700 underline underline-offset-4"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={uploading || images.length >= MAX_IMAGES}
          onChange={(e) => {
            void handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="text-sm"
          aria-label="Add photos"
        />
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Select as many photos as you like, at any size. Large camera photos
          are shrunk in your browser to at most {UPLOAD_MAX_EDGE} pixels on the
          long side before they are saved, which keeps the site fast and still
          looks sharp on any screen. JPG, PNG, or WebP. The first photo is the
          main one. Photos are saved when you click Save gown.
        </p>
        {uploading && (
          <p role="status" className="mt-2 text-sm">
            {progress ?? "Uploading..."}
          </p>
        )}
        {uploadErrors.length > 0 && (
          <ul role="alert" className="mt-2 space-y-1 text-sm text-red-700">
            {uploadErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
        <FieldError name="images" />
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={published}
          className="h-4 w-4 accent-ink"
        />
        Published (visible on the site)
      </label>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-6">
        <SubmitButton disabled={uploading} />
        <Link href="/admin/products" className="text-sm underline underline-offset-4">
          Cancel
        </Link>
      </div>
    </form>
  );
}
