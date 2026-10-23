import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-site py-24 md:py-32">
      <h1 className="text-4xl md:text-5xl">We could not find that page</h1>
      <p className="mt-6 max-w-md text-muted">
        The link may be old, or the gown is no longer in the collection.
      </p>
      <Link href="/collections" className="btn-dark mt-10">
        Back to collections
      </Link>
    </section>
  );
}
