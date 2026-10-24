/** Hanya email di ADMIN_EMAILS yang dianggap admin. Kosong = tidak ada admin. */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}
