import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";
import { getAdminProduct } from "@/lib/admin-products";

export const metadata: Metadata = { title: "Edit gown" };

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const product = await getAdminProduct(id);
  if (!product) notFound();

  return (
    <>
      <h1 className="text-4xl">Edit {product.title}</h1>
      <div className="mt-10">
        <ProductForm product={product} />
      </div>
      <div className="mt-16 max-w-2xl border-t border-line pt-6">
        <DeleteProductButton id={product.id} title={product.title} />
      </div>
    </>
  );
}
