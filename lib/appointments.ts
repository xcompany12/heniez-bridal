export const TIME_SLOTS = [
  { value: "morning", label: "Morning (10:00 AM to 1:00 PM)" },
  { value: "afternoon", label: "Afternoon (2:00 PM to 5:00 PM)" },
] as const;

export const GOWN_SIZES = ["2", "4", "6", "8", "10", "12", "14"] as const;

/** Ukuran badan opsional (cm) beserta rentang yang masuk akal. */
export const MEASUREMENTS = [
  { key: "height_cm", label: "Height", min: 100, max: 230 },
  { key: "bust_cm", label: "Bust", min: 50, max: 200 },
  { key: "waist_cm", label: "Waist", min: 40, max: 200 },
  { key: "hips_cm", label: "Hips", min: 50, max: 220 },
] as const;

export type AppointmentField =
  | "full_name"
  | "email"
  | "phone"
  | "preferred_date"
  | "preferred_time"
  | "notes"
  | "wedding_date"
  | "height_cm"
  | "bust_cm"
  | "waist_cm"
  | "hips_cm";

export type AppointmentValues = {
  full_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  wedding_date: string;
  height_cm: string;
  bust_cm: string;
  waist_cm: string;
  hips_cm: string;
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
    wedding_date: raw.wedding_date ?? "",
    height_cm: raw.height_cm ?? "",
    bust_cm: raw.bust_cm ?? "",
    waist_cm: raw.waist_cm ?? "",
    hips_cm: raw.hips_cm ?? "",
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

  // Tanggal pernikahan: opsional.
  if (v.wedding_date) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(v.wedding_date) ||
      Number.isNaN(Date.parse(v.wedding_date))
    ) {
      errors.wedding_date = "Choose a valid date.";
    } else if (v.wedding_date < todayInJakarta()) {
      errors.wedding_date = "Choose today or a later date.";
    }
  }

  // Ukuran badan: opsional, bilangan bulat dalam cm.
  for (const m of MEASUREMENTS) {
    const value = v[m.key];
    if (!value) continue;
    const n = Number(value);
    if (!/^\d{2,3}$/.test(value) || n < m.min || n > m.max) {
      errors[m.key] = `${m.label}: enter a whole number in cm, between ${m.min} and ${m.max}.`;
    }
  }

  // Isian opsional dari halaman detail gaun: buang bila bentuknya tidak wajar.
  if (!/^[a-z0-9-]{1,60}$/.test(v.gown_slug)) v.gown_slug = "";
  if (!(GOWN_SIZES as readonly string[]).includes(v.size)) v.size = "";
  v.color = v.color.slice(0, 40);

  return { values: v, errors };
}
