import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { updateSession } from "@/lib/supabase/middleware";

// Penjaga lapis pertama. Setiap halaman dan aksi admin tetap memeriksa
// sendiri lewat requireAdmin(), jadi ini bukan satu-satunya pengaman.
export async function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const { response, user } = await updateSession(request);
  const allowed = Boolean(user) && isAdminEmail(user?.email);

  if (!allowed && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = user ? "?error=forbidden" : "";
    return NextResponse.redirect(url);
  }

  if (allowed && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
