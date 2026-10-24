import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductOptions from "@/components/ProductOptions";
import {
  formatIDR,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";

type Props = { params: { slug: string } };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Gown not found" };
  return { title: product.title, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 3);

  const details = [
    { title: "Details and craftsmanship", text: product.craftsmanship },
    {
      title: "Silhouette and material",
      text: `${product.silhouette} silhouette in ${product.material.toLowerCase()}, from the ${product.collection} collection.`,
    },
    {
      title: "Sizing and fit",
      text: "Every gown is fitted to you. Final adjustments are made during your private fitting.",
    },
    {
      title: "Lead time",
      text: "Gowns are made to order. We confirm the timing with you at your fitting.",
    },
  ];

  return (
    <div className="container-site py-10 md:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/collections" className="hover:text-ink">
          Collections
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span aria-current="page" className="text-ink">
          {product.title}
        </span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <ProductGallery images={product.images} title={product.title} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          <h1 className="text-4xl md:text-5xl">{product.title}</h1>
          <p className="mt-3 text-xl">{formatIDR(product.price)}</p>
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            {product.description}
          </p>

          <div className="mt-10">
            <ProductOptions slug={product.slug} colors={product.colors} />
          </div>

          <div className="mt-12 border-t border-line">
            {details.map((item, i) => (
              <details
                key={item.title}
                open={i === 0}
                className="group border-b border-line py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm [&::-webkit-details-marker]:hidden">
                  {item.title}
                  <span aria-hidden="true" className="group-open:hidden">
                    +
                  </span>
                  <span aria-hidden="true" className="hidden group-open:inline">
                    −
                  </span>
                </summary>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                  {item.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24 md:mt-32">
          <h2 className="text-3xl">You may also like</h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
            {related.map((item, i) => (
              <li key={item.id} className={i === 2 ? "hidden md:block" : ""}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
