import Link from "next/link";
import { BRAND, NAV_ITEMS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="font-heading text-2xl tracking-[0.18em]">
            {BRAND.name.toUpperCase()}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Curated gowns, private fittings, and tailoring done in-house.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-3 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <p className="container-site py-6 text-xs text-muted">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
