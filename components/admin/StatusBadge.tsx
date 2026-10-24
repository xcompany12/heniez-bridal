import { STATUS_LABELS, type AppointmentStatus } from "@/lib/admin-appointments";

const STYLES: Record<AppointmentStatus, string> = {
  new: "bg-gold/20 text-ink",
  confirmed: "bg-green-100 text-green-900",
  done: "bg-line text-muted",
  cancelled: "bg-red-50 text-red-800",
};

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`inline-block px-3 py-1 text-xs ${STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
