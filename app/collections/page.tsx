import type { Metadata } from "next";
import CatalogClient from "@/components/CatalogClient";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const products = await getProducts();

  return (
    <div className="container-site py-16 md:py-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl leading-tight md:text-6xl">Discover your dream gown</h1>
        <p className="mt-6 leading-relaxed text-muted">
          Browse by silhouette, material, and collection. Found one you like?
          Book a fitting and try it on.
        </p>
      </header>

      <div className="mt-14">
        <CatalogClient products={products} />
      </div>
    </div>
  );
}
