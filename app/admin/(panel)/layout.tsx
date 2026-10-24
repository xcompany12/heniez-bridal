import type { Metadata } from "next";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";
import { BRAND } from "@/lib/site";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: `%s | ${BRAND.name} admin`,
  },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <header className="border-b border-line">
        <div className="container-site flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <p className="font-heading text-lg tracking-[0.18em]">
              {BRAND.name.toUpperCase()}{" "}
              <span className="font-body text-xs tracking-normal text-muted">
                Admin
              </span>
            </p>
            <AdminNav />
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-muted hover:text-ink">
              View site
            </Link>
            <form action={logout}>
              <button type="submit" className="underline underline-offset-4">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="container-site py-10 md:py-14">{children}</div>
    </div>
  );
}
