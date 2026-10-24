"use server";

import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin-allowlist";
import {
  createSupabaseServerClient,
  isAuthConfigured,
} from "@/lib/supabase/server";

type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password." };
  if (!isAuthConfigured()) return { error: "Admin is not configured yet." };

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Pesan sengaja umum agar tidak membocorkan email mana yang terdaftar.
  if (error || !data.user) return { error: "Email or password is incorrect." };

  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  redirect("/admin");
}
