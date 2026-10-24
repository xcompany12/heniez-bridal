"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="container-site py-24 md:py-32">
      <h1 className="text-4xl md:text-5xl">Something went wrong</h1>
      <p className="mt-6 max-w-md text-muted">
        Please try again. If the problem continues, contact us and we will help.
      </p>
      <button type="button" onClick={reset} className="btn-dark mt-10">
        Try again
      </button>
    </section>
  );
}
