"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import {
  COLLECTIONS,
  MATERIALS,
  SILHOUETTES,
  type Product,
} from "@/lib/products";

type FilterKey = "silhouette" | "material" | "collection";
type Filters = Record<FilterKey, string[]>;
type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

const GROUPS: { key: FilterKey; label: string; options: readonly string[] }[] = [
  { key: "silhouette", label: "Silhouette", options: SILHOUETTES },
  { key: "material", label: "Material", options: MATERIALS },
  { key: "collection", label: "Collection", options: COLLECTIONS },
];

const EMPTY: Filters = { silhouette: [], material: [], collection: [] };

export default function CatalogClient({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState<SortKey>("featured");
  const [panelOpen, setPanelOpen] = useState(false);

  const activeCount =
    filters.silhouette.length + filters.material.length + filters.collection.length;

  const toggle = (key: FilterKey, value: string) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));

  // Dalam satu grup berlaku "atau", antar grup berlaku "dan".
  const visible = useMemo(() => {
    const keys = Object.keys(filters) as FilterKey[];
    const list = products.filter((p) =>
      keys.every((k) => filters[k].length === 0 || filters[k].includes(p[k]))
    );
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

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
      {/* Filter */}
      <aside>
        <button
          type="button"
          className="flex w-full items-center justify-between border border-line px-4 py-3 text-sm lg:hidden"
          aria-expanded={panelOpen}
          aria-controls="filter-panel"
          onClick={() => setPanelOpen((v) => !v)}
        >
          <span>Filters{activeCount > 0 ? ` (${activeCount})` : ""}</span>
          <span aria-hidden="true">{panelOpen ? "−" : "+"}</span>
        </button>

        <div
          id="filter-panel"
          className={`${panelOpen ? "block" : "hidden"} mt-6 space-y-8 lg:mt-0 lg:block`}
        >
          {GROUPS.map((group) => (
            <fieldset key={group.key}>
              <legend className="font-heading text-lg">{group.label}</legend>
              <ul className="mt-3 space-y-2.5">
                {group.options.map((option) => (
                  <li key={option}>
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-muted hover:text-ink">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-ink"
                        checked={filters[group.key].includes(option)}
                        onChange={() => toggle(group.key, option)}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          ))}

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
      </aside>

      {/* Hasil */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <p className="text-sm text-muted" aria-live="polite">
            {visible.length} {visible.length === 1 ? "gown" : "gowns"}
          </p>
          <label className="flex items-center gap-3 text-sm">
            <span className="text-muted">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-line bg-ivory px-3 py-2 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
            </select>
          </label>
        </div>

        {visible.length > 0 ? (
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
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
    </div>
  );
}
