"use client";

import { useRef, useState } from "react";
import type { ProductColor } from "@/lib/product-types";

const MAX_COLORS = 8;

/** Pilihan cepat warna gaun pengantin yang umum. Pemilik tetap bisa memilih warna apa saja. */
const PRESETS: ProductColor[] = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Soft white", hex: "#F7F5F0" },
  { name: "Ivory", hex: "#F3EBDD" },
  { name: "Champagne", hex: "#E6D3B3" },
  { name: "Blush", hex: "#F3D9D6" },
  { name: "Nude", hex: "#E3C9B4" },
  { name: "Light gold", hex: "#D9BE82" },
  { name: "Silver", hex: "#C9C9CC" },
];

type Row = { id: number; name: string; hex: string };

export default function ColorsField({
  initial,
  error,
}: {
  initial: ProductColor[];
  error?: string;
}) {
  const nextId = useRef(initial.length);
  const [rows, setRows] = useState<Row[]>(
    initial.map((c, i) => ({ id: i, name: c.name, hex: c.hex.toLowerCase() }))
  );

  const add = (name: string, hex: string) =>
    setRows((prev) =>
      prev.length >= MAX_COLORS ? prev : [...prev, { id: nextId.current++, name, hex }]
    );
  const update = (id: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRows((prev) => prev.filter((r) => r.id !== id));

  // Format yang dibaca server: satu warna per baris, "Nama, #RRGGBB".
  const value = rows
    .filter((r) => r.name.trim())
    .map((r) => `${r.name.trim()}, ${r.hex.toUpperCase()}`)
    .join("\n");

  const unusedPresets = PRESETS.filter(
    (p) => !rows.some((r) => r.name.trim().toLowerCase() === p.name.toLowerCase())
  );

  return (
    <fieldset>
      <legend className="mb-2 block text-sm">Colors</legend>
      <input type="hidden" name="colors" value={value} />

      {rows.length > 0 && (
        <ul className="space-y-3">
          {rows.map((row, i) => (
            <li key={row.id}>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={row.hex}
                  onChange={(e) => update(row.id, { hex: e.target.value })}
                  aria-label={`Color swatch ${i + 1}`}
                  className="h-11 w-14 shrink-0 cursor-pointer border border-line bg-white/60 p-1"
                />
                <input
                  type="text"
                  value={row.name}
                  maxLength={30}
                  onChange={(e) => update(row.id, { name: e.target.value })}
                  placeholder="Color name, e.g. Champagne"
                  aria-label={`Color name ${i + 1}`}
                  className="w-full border border-line bg-white/60 px-4 py-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  className="shrink-0 text-xs text-red-700 underline underline-offset-4"
                >
                  Remove
                </button>
              </div>
              {!row.name.trim() && (
                <p className="mt-1 text-xs text-red-700">
                  Give this color a name or remove it. Colors without a name are
                  not saved.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {unusedPresets.length > 0 && rows.length < MAX_COLORS && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted">Quick add</p>
          <ul className="flex flex-wrap gap-2">
            {unusedPresets.map((p) => (
              <li key={p.name}>
                <button
                  type="button"
                  onClick={() => add(p.name, p.hex.toLowerCase())}
                  className="flex items-center gap-2 border border-line px-3 py-2 text-xs hover:border-ink"
                >
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 rounded-full border border-line"
                    style={{ backgroundColor: p.hex }}
                  />
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => add("", "#f3ebdd")}
        disabled={rows.length >= MAX_COLORS}
        className="mt-4 text-sm underline underline-offset-4 disabled:opacity-50"
      >
        Add another color
      </button>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Optional. Add the colors this gown comes in; visitors can pick one when
        they book a fitting. Click a swatch to choose any color. If you add
        none, the color choice is hidden on the gown page.
      </p>
      {error && (
        <p id="colors-error" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </fieldset>
  );
}
