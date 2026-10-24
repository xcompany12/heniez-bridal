import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import { BRAND, getSiteUrl } from "@/lib/site";
import "./globals.css";

const heading = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const body = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const TITLE = `${BRAND.name} | ${BRAND.tagline}`;
const DESCRIPTION =
  "Curated wedding gowns, private fittings, and master tailoring. Find the gown made for your day.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: TITLE,
    template: `%s | ${BRAND.name}`,
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/images/products/josephine.jpg",
        width: 736,
        height: 1104,
        alt: "A lace wedding gown with a long veil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory"
        >
          Skip to content
        </a>
        <SiteChrome header={<Header />} footer={<Footer />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
