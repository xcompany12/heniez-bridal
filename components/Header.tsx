"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND, NAV_ITEMS } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Tutup menu mobile setiap pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ivory/95 backdrop-blur">
      <div className="container-site flex items-center justify-between py-5 md:py-6">
        <Link
          href="/"
          className="font-heading text-xl tracking-[0.18em] text-ink md:text-2xl"
        >
          {BRAND.name.toUpperCase()}
        </Link>

        {/* Navigasi desktop */}
        <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`border-b pb-1 text-sm tracking-wide transition-colors ${
                isActive(item.href)
                  ? "border-gold text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/appointments" className="btn-dark !px-6 !py-2.5">
            Book a fitting
          </Link>
        </nav>

        {/* Tombol menu mobile */}
        <button
          type="button"
          className="-mr-2 p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-line bg-ivory md:hidden"
        >
          <div className="container-site flex flex-col py-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`border-b border-line py-4 text-base ${
                  isActive(item.href) ? "text-ink" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/appointments" className="btn-dark mt-6">
              Book a fitting
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
