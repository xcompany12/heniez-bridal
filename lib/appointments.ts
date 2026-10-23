export const TIME_SLOTS = [
  { value: "morning", label: "Morning (10:00 AM to 1:00 PM)" },
  { value: "afternoon", label: "Afternoon (2:00 PM to 5:00 PM)" },
] as const;

export const GOWN_SIZES = ["2", "4", "6", "8", "10", "12", "14"] as const;

export type AppointmentField =
  | "full_name"
  | "email"
  | "phone"
  | "preferred_date"
  | "preferred_time"
  | "notes";

export type AppointmentValues = {
  full_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  gown_slug: string;
  size: string;
  color: string;
};

export type AppointmentState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<AppointmentField, string>>;
  /** Isian pengunjung, dikembalikan agar form tidak kosong saat ada error */
  values?: Partial<AppointmentValues>;
  summary?: { name: string; dateLabel: string; slotLabel: string };
};

export const INITIAL_STATE: AppointmentState = { status: "idle" };

/** Tanggal hari ini (YYYY-MM-DD) menurut waktu Jakarta. */
export function todayInJakarta(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
}

export function formatDateLabel(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function validateAppointment(raw: Record<string, string>) {
  const v: AppointmentValues = {
    full_name: raw.full_name ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    preferred_date: raw.preferred_date ?? "",
    preferred_time: raw.preferred_time ?? "",
    notes: raw.notes ?? "",
    gown_slug: raw.gown_slug ?? "",
    size: raw.size ?? "",
    color: raw.color ?? "",
  };

  const errors: Partial<Record<AppointmentField, string>> = {};

  if (v.full_name.length < 2 || v.full_name.length > 100) {
    errors.full_name = "Enter your full name.";
  }
  if (v.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!/^\+?[0-9][0-9\s-]{6,18}$/.test(v.phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(v.preferred_date) ||
    Number.isNaN(Date.parse(v.preferred_date))
  ) {
    errors.preferred_date = "Choose a date.";
  } else if (v.preferred_date < todayInJakarta()) {
    errors.preferred_date = "Choose today or a later date.";
  }
  if (!TIME_SLOTS.some((s) => s.value === v.preferred_time)) {
    errors.preferred_time = "Choose a time.";
  }
  if (v.notes.length > 1000) {
    errors.notes = "Keep your notes under 1,000 characters.";
  }

  // Isian opsional dari halaman detail gaun: buang bila bentuknya tidak wajar.
  if (!/^[a-z0-9-]{1,60}$/.test(v.gown_slug)) v.gown_slug = "";
  if (!(GOWN_SIZES as readonly string[]).includes(v.size)) v.size = "";
  v.color = v.color.slice(0, 40);

  return { values: v, errors };
}
