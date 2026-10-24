"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { isStatus } from "@/lib/admin-appointments";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function updateAppointmentStatus(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!UUID.test(id) || !isStatus(status)) return;

  const db = getSupabaseAdmin();
  if (!db) return;

  const { error } = await db.from("appointments").update({ status }).eq("id", id);
  if (error) console.error("Could not update appointment:", error.message);

  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
}

export async function logout(): Promise<void> {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
