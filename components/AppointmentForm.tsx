"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { createAppointment } from "@/app/appointments/actions";
import {
  INITIAL_STATE,
  TIME_SLOTS,
  type AppointmentField,
} from "@/lib/appointments";

type Props = {
  minDate: string;
  gown: { slug: string; title: string } | null;
  size: string;
  color: string;
};

const inputClass =
  "w-full border border-line bg-white/60 px-4 py-3 text-sm placeholder:text-muted/60";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-dark w-full disabled:opacity-60"
    >
      {pending ? "Sending..." : "Request appointment"}
    </button>
  );
}

export default function AppointmentForm({ minDate, gown, size, color }: Props) {
  const [state, formAction] = useFormState(createAppointment, INITIAL_STATE);

  if (state.status === "success") {
    return (
      <div role="status" className="border border-line bg-white/60 p-8 md:p-10">
        <h2 className="text-3xl">Request received</h2>
        {state.summary ? (
          <p className="mt-4 leading-relaxed text-muted">
            Thank you, {state.summary.name}. We will contact you to confirm{" "}
            {state.summary.dateLabel}, {state.summary.slotLabel.toLowerCase()}.
          </p>
        ) : (
          <p className="mt-4 leading-relaxed text-muted">
            Thank you. We will contact you to confirm your fitting.
          </p>
        )}
        <Link href="/collections" className="btn-outline mt-8">
          Keep browsing
        </Link>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  const fieldProps = (name: AppointmentField) => ({
    id: name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    className: inputClass,
  });

  const FieldError = ({ name }: { name: AppointmentField }) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-2 text-sm text-red-700">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {gown && (
        <div className="border border-line bg-blush/20 p-4 text-sm">
          <p>
            Gown: <strong className="font-medium">{gown.title}</strong>
            {size ? `, size ${size}` : ""}
            {color ? `, ${color}` : ""}
          </p>
          <Link href="/collections" className="mt-1 inline-block text-muted underline underline-offset-4">
            Choose a different gown
          </Link>
          <input type="hidden" name="gown_slug" value={gown.slug} />
          <input type="hidden" name="size" value={size} />
          <input type="hidden" name="color" value={color} />
        </div>
      )}

      <div>
        <label htmlFor="full_name" className="mb-2 block text-sm">
          Full name
        </label>
        <input
          {...fieldProps("full_name")}
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          defaultValue={values.full_name}
        />
        <FieldError name="full_name" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm">
            Email address
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            defaultValue={values.email}
          />
          <FieldError name="email" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm">
            Phone number
          </label>
          <input
            {...fieldProps("phone")}
            type="tel"
            autoComplete="tel"
            placeholder="+62 812 0000 0000"
            defaultValue={values.phone}
          />
          <FieldError name="phone" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="preferred_date" className="mb-2 block text-sm">
            Preferred date
          </label>
          <input
            {...fieldProps("preferred_date")}
            type="date"
            min={minDate}
            defaultValue={values.preferred_date}
          />
          <FieldError name="preferred_date" />
        </div>
        <div>
          <label htmlFor="preferred_time" className="mb-2 block text-sm">
            Preferred time
          </label>
          <select
            {...fieldProps("preferred_time")}
            defaultValue={values.preferred_time ?? TIME_SLOTS[0].value}
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
          <FieldError name="preferred_time" />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-2 block text-sm">
          Tell us about your wedding and style (optional)
        </label>
        <textarea
          {...fieldProps("notes")}
          rows={4}
          placeholder="Wedding date, venue, or the silhouettes you like"
          defaultValue={values.notes}
        />
        <FieldError name="notes" />
      </div>

      {/* Kolom jebakan bot: disembunyikan dari pengunjung */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm text-red-700">
          {state.message}
        </p>
      )}

      <SubmitButton />
      <p className="text-xs leading-relaxed text-muted">
        This is a request, not a confirmed booking. Our team will contact you
        to confirm.
      </p>
    </form>
  );
}
