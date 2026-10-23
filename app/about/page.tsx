import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <PagePlaceholder
      title="About us"
      note="Dibangun di Tahap 5."
    />
  );
}
