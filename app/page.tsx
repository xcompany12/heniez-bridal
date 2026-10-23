import Link from "next/link";

export default function HomePage() {
  return (
    <section className="container-site py-24 md:py-40">
      <h1 className="max-w-3xl text-5xl leading-[1.1] md:text-7xl">
        The gown you picture, made to fit you.
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
        Browse a curated collection, then book a private fitting with our
        seamstresses.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/collections" className="btn-dark">
          Browse collections
        </Link>
        <Link href="/appointments" className="btn-outline">
          Book a fitting
        </Link>
      </div>
    </section>
  );
}
