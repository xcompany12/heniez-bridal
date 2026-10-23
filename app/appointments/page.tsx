import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = { title: "Appointments" };

export default function AppointmentsPage() {
  return (
    <PagePlaceholder
      title="Book a fitting"
      note="Dibangun di Tahap 4: form appointment yang tersimpan ke database."
    />
  );
}
