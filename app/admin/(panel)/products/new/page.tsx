import type { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";
import { getAdminProducts } from "@/lib/admin-products";
import { uniqueLabels } from "@/lib/product-types";

export const metadata: Metadata = { title: "Add gown" };

export default async function NewProductPage() {
  await requireAdmin();

  const { rows } = await getAdminProducts();
  const suggestions = {
    silhouette: uniqueLabels(rows.map((r) => r.silhouette)),
    material: uniqueLabels(rows.map((r) => r.material)),
    collection: uniqueLabels(rows.map((r) => r.collection)),
  };

  return (
    <>
      <h1 className="text-4xl">Add gown</h1>
      <div className="mt-10">
        <ProductForm suggestions={suggestions} />
      </div>
    </>
  );
}
