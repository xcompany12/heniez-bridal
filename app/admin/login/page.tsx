import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

type Props = { searchParams: { error?: string } };

export default function AdminLoginPage({ searchParams }: Props) {
  const notice =
    searchParams.error === "forbidden"
      ? "This account does not have admin access."
      : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="font-heading text-xl tracking-[0.18em]">
          {BRAND.name.toUpperCase()}
        </p>
        <h1 className="mt-8 text-3xl">Admin sign in</h1>
        <div className="mt-8">
          <LoginForm notice={notice} />
        </div>
      </div>
    </div>
  );
}
