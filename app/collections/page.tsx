import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return (
    <PagePlaceholder
      title="Collections"
      note="Dibangun di Tahap 2: grid produk dengan filter dan sort."
    />
  );
}
