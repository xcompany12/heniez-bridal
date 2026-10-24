import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "About us",
  description:
    "A curated bridal boutique with private consultations and in-house master tailoring.",
};

// Lookbook membaca gaun dari database.
export const dynamic = "force-dynamic";

const FEATURES = [
  {
    title: "Curated selection",
    text: "Exclusive designs from respected bridal ateliers, chosen for their craftsmanship.",
  },
  {
    title: "Private consultations",
    text: "An intimate, one-on-one styling session in our private suites, dedicated entirely to you.",
  },
  {
    title: "Master tailoring",
    text: "Our in-house seamstresses fit your gown to your silhouette so it moves the way you do.",
  },
];

export default async function AboutPage() {
  // Lookbook memakai dua gaun pertama yang punya foto.
  const all = await getProducts();
  const featured = all.filter((p) => p.images.length > 0).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-blush/20">
        <div className="container-site py-20 md:py-32">
          <h1 className="max-w-3xl text-5xl leading-[1.1] md:text-7xl">
            Ethereal elegance for the modern romantic
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
            A curated journey to your perfect gown, shaped around your vision
            and your style.
          </p>
        </div>
      </section>

      {/* Pengalaman */}
      <section className="container-site py-20 md:py-28">
        <h2 className="max-w-lg text-3xl md:text-4xl">The Heniez experience</h2>
        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {FEATURES.map((item) => (
            <li key={item.title} className="border-t border-gold pt-5">
              <h3 className="text-xl">{item.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Lookbook */}
      {featured.length > 0 && (
        <section className="container-site pb-20 md:pb-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl md:text-4xl">The lookbook</h2>
            <Link
              href="/collections"
              className="text-sm underline underline-offset-4"
            >
              View all collections
            </Link>
          </div>

          <ul className="mt-10 grid items-end gap-8 md:grid-cols-[1.35fr_1fr] md:gap-12">
            {featured.map((product, i) => (
              <li key={product.id}>
                <Link href={`/products/${product.slug}`} className="group block">
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-line/40">
                    <Image
                      src={product.images[0]}
                      alt={`${product.title} wedding gown`}
                      fill
                      sizes={
                        i === 0
                          ? "(min-width: 768px) 55vw, 100vw"
                          : "(min-width: 768px) 40vw, 100vw"
                      }
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-heading text-xl underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-gold">
                      {product.title}
                    </h3>
                    <span className="text-sm text-muted">{product.collection}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Penutup */}
      <section className="border-t border-line">
        <div className="container-site py-20 text-center md:py-28">
          <h2 className="mx-auto max-w-xl text-3xl md:text-4xl">
            Begin your journey
          </h2>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">
            Experience our collections in a private appointment made around
            your vision.
          </p>
          <Link href="/appointments" className="btn-dark mt-8">
            Request an appointment
          </Link>
        </div>
      </section>
    </>
  );
}
