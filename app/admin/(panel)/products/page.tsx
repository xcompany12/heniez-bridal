import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getAdminProducts } from "@/lib/admin-products";
import { formatIDR } from "@/lib/product-types";

export const metadata: Metadata = { title: "Gowns" };

export default async function AdminProductsPage() {
  await requireAdmin();
  const { rows, failed } = await getAdminProducts();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl">Gowns</h1>
        <Link href="/admin/products/new" className="btn-dark">
          Add gown
        </Link>
      </div>

      {failed ? (
        <p className="mt-10 text-sm text-red-700">
          Could not load gowns. Check the Supabase settings and that the
          products table exists.
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-10 text-sm text-muted">No gowns yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center gap-5 py-5"
            >
              <div className="h-24 w-16 shrink-0 overflow-hidden bg-line/40">
                {row.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-heading text-xl">{row.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {row.silhouette}, {row.material}, {row.collection}
                </p>
                <p className="mt-1 text-sm">{formatIDR(Number(row.price))}</p>
              </div>

              <span
                className={`inline-block px-3 py-1 text-xs ${
                  row.is_published
                    ? "bg-green-100 text-green-900"
                    : "bg-line text-muted"
                }`}
              >
                {row.is_published ? "Published" : "Draft"}
              </span>

              <div className="flex gap-5 text-sm">
                <Link
                  href={`/admin/products/${row.id}/edit`}
                  className="underline underline-offset-4"
                >
                  Edit
                </Link>
                {row.is_published && (
                  <Link
                    href={`/products/${row.slug}`}
                    className="text-muted underline underline-offset-4"
                  >
                    View
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
