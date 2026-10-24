import type { Metadata } from "next";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/admin";
import {
  STATUSES,
  STATUS_LABELS,
  getAppointments,
  getStatusCounts,
  isStatus,
  toWhatsAppNumber,
} from "@/lib/admin-appointments";
import { TIME_SLOTS, formatDateLabel } from "@/lib/appointments";
import { getProducts } from "@/lib/products";
import { updateAppointmentStatus } from "../actions";

export const metadata: Metadata = { title: "Appointments" };

type Props = { searchParams: { status?: string } };

function formatCreated(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
}

export default async function AdminAppointmentsPage({ searchParams }: Props) {
  await requireAdmin();

  const filter =
    searchParams.status && isStatus(searchParams.status)
      ? searchParams.status
      : undefined;

  const [{ rows, failed }, counts, products] = await Promise.all([
    getAppointments(filter),
    getStatusCounts(),
    getProducts(),
  ]);
  const gownTitles = new Map(products.map((p) => [p.slug, p.title]));

  const tabs = [
    { label: "All", href: "/admin/appointments", active: !filter, count: null },
    ...STATUSES.map((s) => ({
      label: STATUS_LABELS[s],
      href: `/admin/appointments?status=${s}`,
      active: filter === s,
      count: counts ? counts[s] : null,
    })),
  ];

  return (
    <>
      <h1 className="text-4xl">Appointments</h1>

      <nav aria-label="Filter by status" className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={tab.active ? "page" : undefined}
            className={`border px-4 py-2 text-sm transition-colors ${
              tab.active
                ? "border-ink bg-ink text-ivory"
                : "border-line hover:border-ink"
            }`}
          >
            {tab.label}
            {tab.count !== null ? ` (${tab.count})` : ""}
          </Link>
        ))}
      </nav>

      {failed ? (
        <p className="mt-10 text-sm text-red-700">
          Could not load appointments. Check the Supabase settings.
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-10 text-sm text-muted">No requests here yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((row) => {
            const slot = TIME_SLOTS.find((s) => s.value === row.preferred_time);
            const gown = row.gown_slug
              ? (gownTitles.get(row.gown_slug) ?? row.gown_slug)
              : null;
            const whatsapp = toWhatsAppNumber(row.phone);

            return (
              <li
                key={row.id}
                className="border border-line bg-white/60 p-5 md:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl">{row.full_name}</h2>
                    <p className="mt-1 text-sm text-muted">
                      Requested {formatCreated(row.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={row.status} />
                </div>

                <dl className="mt-5 grid gap-x-8 gap-y-4 text-sm md:grid-cols-3">
                  <div>
                    <dt className="text-muted">Preferred time</dt>
                    <dd className="mt-1">
                      {formatDateLabel(row.preferred_date)}
                      <br />
                      {slot ? slot.label : row.preferred_time}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">Contact</dt>
                    <dd className="mt-1 space-y-1">
                      <a
                        href={`mailto:${row.email}`}
                        className="block underline underline-offset-4"
                      >
                        {row.email}
                      </a>
                      <a
                        href={`tel:${row.phone.replace(/\s/g, "")}`}
                        className="block underline underline-offset-4"
                      >
                        {row.phone}
                      </a>
                      {whatsapp && (
                        <a
                          href={`https://wa.me/${whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block underline underline-offset-4"
                        >
                          Open in WhatsApp
                        </a>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">Gown</dt>
                    <dd className="mt-1">
                      {gown ? (
                        <>
                          {gown}
                          {row.size ? `, size ${row.size}` : ""}
                          {row.color ? `, ${row.color}` : ""}
                        </>
                      ) : (
                        <span className="text-muted">None selected</span>
                      )}
                    </dd>
                  </div>
                </dl>

                {row.notes && (
                  <p className="mt-4 text-sm leading-relaxed">
                    <span className="text-muted">Notes: </span>
                    {row.notes}
                  </p>
                )}

                <form
                  action={updateAppointmentStatus}
                  className="mt-5 flex items-center gap-3 border-t border-line pt-4"
                >
                  <input type="hidden" name="id" value={row.id} />
                  <label htmlFor={`status-${row.id}`} className="text-sm text-muted">
                    Status
                  </label>
                  <select
                    id={`status-${row.id}`}
                    name="status"
                    defaultValue={row.status}
                    className="border border-line bg-ivory px-3 py-2 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn-outline !px-5 !py-2 text-sm">
                    Save
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
