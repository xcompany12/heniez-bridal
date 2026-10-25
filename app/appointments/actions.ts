"use server";

import {
  TIME_SLOTS,
  formatDateLabel,
  validateAppointment,
  type AppointmentState,
} from "@/lib/appointments";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function createAppointment(
  _prev: AppointmentState,
  formData: FormData
): Promise<AppointmentState> {
  const raw: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") raw[key] = value.trim();
  });

  // Kolom jebakan untuk bot: pengunjung asli tidak melihat dan tidak mengisinya.
  if (raw.website) return { status: "success", summary: undefined };

  const { values, errors } = validateAppointment(raw);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please check the fields marked below.",
      errors,
      values,
    };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("Supabase environment variables are missing.");
    return {
      status: "error",
      message: "Booking is not available right now. Please try again later.",
      values,
    };
  }

  const { error } = await supabase.from("appointments").insert({
    full_name: values.full_name,
    email: values.email,
    phone: values.phone,
    preferred_date: values.preferred_date,
    preferred_time: values.preferred_time,
    gown_slug: values.gown_slug || null,
    size: values.size || null,
    color: values.color || null,
    notes: values.notes || null,
    // Kolom tambahan hanya dikirim bila diisi.
    ...(values.wedding_date ? { wedding_date: values.wedding_date } : {}),
    ...(values.height_cm ? { height_cm: Number(values.height_cm) } : {}),
    ...(values.bust_cm ? { bust_cm: Number(values.bust_cm) } : {}),
    ...(values.waist_cm ? { waist_cm: Number(values.waist_cm) } : {}),
    ...(values.hips_cm ? { hips_cm: Number(values.hips_cm) } : {}),
  });

  if (error) {
    console.error("Could not save appointment:", error.message);
    return {
      status: "error",
      message: "We could not save your request. Please try again.",
      values,
    };
  }

  const slot = TIME_SLOTS.find((s) => s.value === values.preferred_time);
  return {
    status: "success",
    summary: {
      name: values.full_name,
      dateLabel: formatDateLabel(values.preferred_date),
      slotLabel: slot ? slot.label : "",
    },
  };
}
