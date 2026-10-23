import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PagePlaceholder from "@/components/PagePlaceholder";
import { getProductBySlug, products } from "@/lib/products";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return { title: product?.title ?? "Gown" };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <PagePlaceholder
      title={product.title}
      note="Halaman detail lengkap (galeri, ukuran, warna) dibangun di Tahap 3."
    />
  );
}
