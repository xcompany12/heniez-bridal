import type { Metadata } from "next";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/admin";
import {
  STATUSES,
  STATUS_LABELS,
  getAppointments,
  getStatusCounts,
} from "@/lib/admin-appointments";
import { TIME_SLOTS, formatDateLabel } from "@/lib/appointments";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [counts, recent] = await Promise.all([
    getStatusCounts(),
    getAppointments(undefined, 5),
  ]);

  return (
    <>
      <h1 className="text-4xl">Dashboard</h1>

      {counts ? (
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATUSES.map((s) => (
            <li key={s}>
              <Link
                href={`/admin/appointments?status=${s}`}
                className="block border border-line bg-white/60 p-5 transition-colors hover:border-ink"
              >
                <p className="text-sm text-muted">{STATUS_LABELS[s]}</p>
                <p className="mt-2 font-heading text-4xl">{counts[s]}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-sm text-red-700">
          The database is not configured. Check the Supabase environment
          variables.
        </p>
      )}

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl">Latest requests</h2>
          <Link
            href="/admin/appointments"
            className="text-sm underline underline-offset-4"
          >
            View all
          </Link>
        </div>

        {recent.failed ? (
          <p className="mt-6 text-sm text-red-700">
            Could not load appointments.
          </p>
        ) : recent.rows.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No requests yet.</p>
        ) : (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {recent.rows.map((row) => {
              const slot = TIME_SLOTS.find((s) => s.value === row.preferred_time);
              return (
                <li
                  key={row.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p>{row.full_name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {formatDateLabel(row.preferred_date)}
                      {slot ? `, ${slot.value}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={row.status} />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
