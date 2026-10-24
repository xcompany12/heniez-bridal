"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/app/admin/login/actions";

type LoginState = { error?: string };
const INITIAL: LoginState = {};

const inputClass =
  "w-full border border-line bg-white/60 px-4 py-3 text-sm";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-dark w-full disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export default function LoginForm({ notice }: { notice?: string }) {
  const [state, formAction] = useFormState(login, INITIAL);
  const message = state.error ?? notice;

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      {message && (
        <p role="alert" className="text-sm text-red-700">
          {message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
