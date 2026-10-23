"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductColor } from "@/lib/products";

const SIZES = ["2", "4", "6", "8", "10", "12", "14"];

export default function ProductOptions({
  slug,
  colors,
}: {
  slug: string;
  colors: ProductColor[];
}) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(colors[0].name);

  // Pilihan ikut terbawa ke form appointment (dibaca di Tahap 4).
  const params = new URLSearchParams({ gown: slug, color });
  if (size) params.set("size", size);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm">
          Size <span className="text-muted">(US)</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              onClick={() => setSize(size === s ? null : s)}
              className={`h-11 w-11 border text-sm transition-colors ${
                size === s
                  ? "border-ink bg-ink text-ivory"
                  : "border-line hover:border-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          Not sure? We take your measurements at the fitting.
        </p>
      </div>

      <div>
        <p className="text-sm">
          Color: <span className="text-muted">{color}</span>
        </p>
        <div className="mt-3 flex gap-3">
          {colors.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-label={c.name}
              aria-pressed={color === c.name}
              onClick={() => setColor(c.name)}
              className={`h-9 w-9 rounded-full border border-line outline outline-offset-2 transition-all ${
                color === c.name ? "outline-2 outline-ink" : "outline-0"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <Link
        href={`/appointments?${params.toString()}`}
        className="btn-dark w-full"
      >
        Book a fitting for this gown
      </Link>
    </div>
  );
}
