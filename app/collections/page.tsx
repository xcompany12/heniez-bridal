import type { Metadata } from "next";
import CatalogClient from "@/components/CatalogClient";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Collections" };

// Data gaun datang dari database, jadi halaman dibuat setiap diminta.
export const dynamic = "force-dynamic";

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
        {products.length > 0 ? (
          <CatalogClient products={products} />
        ) : (
          <p className="py-16 text-muted">
            Our collection is being updated. Please check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
