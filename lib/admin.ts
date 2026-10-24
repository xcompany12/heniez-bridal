import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin-allowlist";
import {
  createSupabaseServerClient,
  isAuthConfigured,
} from "@/lib/supabase/server";

/**
 * Panggil di awal SETIAP halaman dan Server Action admin.
 * Server Action bisa dipanggil langsung dari luar, jadi jangan hanya
 * mengandalkan middleware.
 */
export async function requireAdmin() {
  if (!isAuthConfigured()) redirect("/admin/login");

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) redirect("/admin/login");
  return user;
}
