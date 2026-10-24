"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Menyembunyikan header dan footer situs publik di halaman /admin. */
export default function SiteChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const isAdmin = usePathname().startsWith("/admin");

  return (
    <>
      {!isAdmin && header}
      <main id="main" className="flex-1">
        {children}
      </main>
      {!isAdmin && footer}
    </>
  );
}
