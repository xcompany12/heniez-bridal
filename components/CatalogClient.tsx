"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { uniqueLabels, type Product } from "@/lib/product-types";
import { SELECT_STYLE } from "@/lib/ui";

type FilterKey = "silhouette" | "material" | "collection";
type Filters = Record<FilterKey, string[]>;
type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

const GROUPS: { key: FilterKey; label: string }[] = [
  { key: "silhouette", label: "Silhouette" },
  { key: "material", label: "Material" },
  { key: "collection", label: "Collection" },
];

const KEYS: FilterKey[] = ["silhouette", "material", "collection"];
const EMPTY: Filters = { silhouette: [], material: [], collection: [] };

const norm = (value: string) => value.trim().toLowerCase();

/** Apakah gaun lolos filter. `skip` = abaikan satu grup (untuk menghitung jumlah per pilihan). */
function matches(p: Product, filters: Filters, skip?: FilterKey): boolean {
  return KEYS.every(
    (k) =>
      k === skip ||
      filters[k].length === 0 ||
      filters[k].some((selected) => norm(selected) === norm(p[k]))
  );
}

export default function CatalogClient({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState<SortKey>("featured");
  const [panelOpen, setPanelOpen] = useState(false);

  // Pilihan filter dibentuk dari isi katalog, jadi otomatis mengikuti yang diketik pemilik.
  const options = useMemo(
    () => ({
      silhouette: uniqueLabels(products.map((p) => p.silhouette)),
      material: uniqueLabels(products.map((p) => p.material)),
      collection: uniqueLabels(products.map((p) => p.collection)),
    }),
    [products]
  );

  // Jumlah gaun per pilihan, dengan memperhitungkan filter di grup lain.
  const counts = useMemo(() => {
    const result = {} as Record<FilterKey, Record<string, number>>;
    for (const key of KEYS) {
      result[key] = {};
      for (const option of options[key]) {
        result[key][option] = products.filter(
          (p) => matches(p, filters, key) && norm(p[key]) === norm(option)
        ).length;
      }
    }
    return result;
  }, [products, filters, options]);

  const activeCount =
    filters.silhouette.length + filters.material.length + filters.collection.length;

  const toggle = (key: FilterKey, value: string) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));

  const visible = useMemo(() => {
    const list = products.filter((p) => matches(p, filters));
    switch (sort) {
      case "newest":
        return [...list].sort((a, b) => b.id - a.id);
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      default:
        return list;
    }
  }, [products, filters, sort]);

  const visibleGroups = GROUPS.filter((g) => options[g.key].length > 0);

  return (
    <div>
      {/* Filter */}
      <div className="border-y border-line py-5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-sm lg:hidden"
          aria-expanded={panelOpen}
          aria-controls="filter-panel"
          onClick={() => setPanelOpen((v) => !v)}
        >
          <span>Filters{activeCount > 0 ? ` (${activeCount})` : ""}</span>
          <span aria-hidden="true">{panelOpen ? "−" : "+"}</span>
        </button>

        <div
          id="filter-panel"
          className={`${panelOpen ? "block" : "hidden"} space-y-6 pt-5 lg:flex lg:flex-wrap lg:gap-x-14 lg:gap-y-6 lg:space-y-0 lg:pt-0`}
        >
          {visibleGroups.map((group) => (
            <fieldset key={group.key} className="min-w-0">
              <legend className="mb-3 font-heading text-base">{group.label}</legend>
              <ul className="flex flex-wrap gap-2">
                {options[group.key].map((option) => {
                  const selected = filters[group.key].includes(option);
                  const count = counts[group.key][option] ?? 0;
                  const unavailable = !selected && count === 0;

                  return (
                    <li key={option}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        disabled={unavailable}
                        onClick={() => toggle(group.key, option)}
                        className={`border px-4 py-2 text-sm transition-colors ${
                          selected
                            ? "border-ink bg-ink text-ivory"
                            : unavailable
                              ? "cursor-not-allowed border-line text-muted/50"
                              : "border-line hover:border-ink"
                        }`}
                      >
                        {option}
                        <span
                          className={`ml-2 text-xs ${
                            selected ? "text-ivory/70" : "text-muted"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          ))}
        </div>
      </div>

      {/* Ringkasan dan urutan */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
        <div className="flex items-center gap-5">
          <p className="text-sm text-muted" aria-live="polite">
            {visible.length} {visible.length === 1 ? "gown" : "gowns"}
          </p>
          {activeCount > 0 && (
            <button
              type="button"
              className="text-sm underline underline-offset-4"
              onClick={() => setFilters(EMPTY)}
            >
              Clear all filters
            </button>
          )}
        </div>
        <label className="flex items-center gap-3 text-sm">
          <span className="text-muted">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            style={SELECT_STYLE}
            className="appearance-none border border-line bg-ivory py-2 pl-3 pr-9 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </label>
      </div>

      {/* Hasil */}
      {visible.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-24 text-center">
          <p className="font-heading text-2xl">No gowns match these filters.</p>
          <p className="mt-3 text-sm text-muted">
            Remove a filter to see more of the collection.
          </p>
          <button
            type="button"
            className="btn-outline mt-8"
            onClick={() => setFilters(EMPTY)}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
