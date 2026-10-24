import type { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Add gown" };

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <>
      <h1 className="text-4xl">Add gown</h1>
      <div className="mt-10">
        <ProductForm />
      </div>
    </>
  );
}
