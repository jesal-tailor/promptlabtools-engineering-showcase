import type { StatusTone } from "@/lib/workflowDisplay";

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  info: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  warning: "border-amber-300/30 bg-amber-300/10 text-amber-200",
  success: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  danger: "border-red-300/30 bg-red-300/10 text-red-200",
};

type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
};

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
