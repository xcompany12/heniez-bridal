import type { Metadata } from "next";
import AppointmentForm from "@/components/AppointmentForm";
import { GOWN_SIZES, todayInJakarta } from "@/lib/appointments";
import { getProductBySlug } from "@/lib/products";

export const metadata: Metadata = { title: "Book a fitting" };

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const EXPECT = [
  {
    title: "Your experience",
    text: "A 90-minute private consultation with a dedicated bridal stylist who helps curate looks for your vision.",
  },
  {
    title: "Expert guidance",
    text: "Bring up to 3 guests to share the moment in a quiet, private fitting suite.",
  },
  {
    title: "Exclusive gowns",
    text: "Try pieces from our collection and custom work made only for the boutique.",
  },
];

export default async function AppointmentsPage({ searchParams }: Props) {
  // Pilihan dari halaman detail gaun. Hanya nilai yang dikenal yang dipakai.
  const slug = first(searchParams.gown);
  const gown = slug ? await getProductBySlug(slug) : undefined;
  const sizeParam = first(searchParams.size) ?? "";
  const colorParam = first(searchParams.color) ?? "";

  const size = (GOWN_SIZES as readonly string[]).includes(sizeParam) ? sizeParam : "";
  const color =
    gown && gown.colors.some((c) => c.name === colorParam) ? colorParam : "";

  return (
    <div className="container-site py-16 md:py-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl leading-tight md:text-6xl">Schedule a consultation</h1>
        <p className="mt-6 leading-relaxed text-muted">
          Choose a date and time for a private fitting. We will contact you to
          confirm.
        </p>
      </header>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
        <div>
          <h2 className="mb-8 text-2xl">Request an appointment</h2>
          <AppointmentForm
            minDate={todayInJakarta()}
            gown={gown ? { slug: gown.slug, title: gown.title } : null}
            size={gown ? size : ""}
            color={color}
          />
        </div>

        <div>
          <h2 className="mb-8 text-2xl">What to expect</h2>
          <ul className="space-y-8">
            {EXPECT.map((item) => (
              <li key={item.title} className="border-t border-gold pt-5">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
