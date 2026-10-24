import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const STATUSES = ["new", "confirmed", "done", "cancelled"] as const;
export type AppointmentStatus = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  done: "Done",
  cancelled: "Cancelled",
};

export type AppointmentRow = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  gown_slug: string | null;
  size: string | null;
  color: string | null;
  notes: string | null;
  status: AppointmentStatus;
};

export function isStatus(value: string): value is AppointmentStatus {
  return (STATUSES as readonly string[]).includes(value);
}

/** Hanya dipanggil setelah requireAdmin() lolos. */
export async function getAppointments(
  status?: AppointmentStatus,
  limit = 100
): Promise<{ rows: AppointmentRow[]; failed: boolean }> {
  const db = getSupabaseAdmin();
  if (!db) return { rows: [], failed: true };

  let query = db
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    console.error("Could not load appointments:", error.message);
    return { rows: [], failed: true };
  }
  return { rows: (data ?? []) as AppointmentRow[], failed: false };
}

export async function getStatusCounts(): Promise<Record<
  AppointmentStatus,
  number
> | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;

  const entries = await Promise.all(
    STATUSES.map(async (s) => {
      const { count } = await db
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("status", s);
      return [s, count ?? 0] as const;
    })
  );
  return Object.fromEntries(entries) as Record<AppointmentStatus, number>;
}

/** Nomor telepon Indonesia menjadi format wa.me (62...). */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}
