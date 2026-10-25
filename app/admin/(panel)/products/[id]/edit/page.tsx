import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";
import { getAdminProduct, getAdminProducts } from "@/lib/admin-products";
import { uniqueLabels } from "@/lib/product-types";

export const metadata: Metadata = { title: "Edit gown" };

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const [product, { rows }] = await Promise.all([
    getAdminProduct(id),
    getAdminProducts(),
  ]);
  if (!product) notFound();

  const suggestions = {
    silhouette: uniqueLabels(rows.map((r) => r.silhouette)),
    material: uniqueLabels(rows.map((r) => r.material)),
    collection: uniqueLabels(rows.map((r) => r.collection)),
  };

  return (
    <>
      <h1 className="text-4xl">Edit {product.title}</h1>
      <div className="mt-10">
        <ProductForm product={product} suggestions={suggestions} />
      </div>
      <div className="mt-16 max-w-2xl border-t border-line pt-6">
        <DeleteProductButton id={product.id} title={product.title} />
      </div>
    </>
  );
}
