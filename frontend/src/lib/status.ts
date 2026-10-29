/**
 * Central status colour system.
 *
 * Every status string used across Quotations, Invoices, Receipts and
 * Inquiries maps to a consistent set of Tailwind utility classes so that
 * users can instantly recognise state at a glance.
 *
 * Palette:
 *   Green  (success)   → paid / approved / won
 *   Amber  (warning)   → partial / sent / quoted / contacted
 *   Blue   (primary)   → draft / new
 *   Red    (destructive) → unpaid / overdue / lost / cancelled / rejected
 *   Slate  (muted)     → unknown / fallback
 */

export type StatusKey =
  // Invoice / Receipt
  | "paid"
  | "partial"
  | "unpaid"
  | "overdue"
  | "cancelled"
  // Quotation
  | "draft"
  | "sent"
  | "approved"
  | "rejected"
  // Inquiry pipeline
  | "new"
  | "contacted"
  | "quoted"
  | "won"
  | "lost"
  // Generic
  | string;

interface StatusStyle {
  badge: string; // full className for a Badge or <span> pill
  dot: string; // small circle indicator
  text: string; // text-only colour
  label: string; // human-readable label
}

const STYLES: Record<string, StatusStyle> = {
  // ── Positive / complete ──────────────────────────────────────────────────
  paid: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    label: "Paid",
  },
  approved: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    label: "Approved",
  },
  won: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    label: "Won",
  },

  // ── In-progress / amber ──────────────────────────────────────────────────
  partial: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-700",
    label: "Partial",
  },
  sent: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-700",
    label: "Sent",
  },
  quoted: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-700",
    label: "Quoted",
  },
  contacted: {
    badge: "bg-sky-50 text-sky-700 border border-sky-200",
    dot: "bg-sky-500",
    text: "text-sky-700",
    label: "Contacted",
  },

  // ── Neutral / draft ──────────────────────────────────────────────────────
  draft: {
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
    text: "text-slate-600",
    label: "Draft",
  },
  new: {
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    text: "text-blue-700",
    label: "New",
  },

  // ── Negative / red ───────────────────────────────────────────────────────
  unpaid: {
    badge: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    text: "text-red-700",
    label: "Unpaid",
  },
  overdue: {
    badge: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-600",
    text: "text-red-700",
    label: "Overdue",
  },
  rejected: {
    badge: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    text: "text-red-700",
    label: "Rejected",
  },
  cancelled: {
    badge: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    text: "text-red-700",
    label: "Cancelled",
  },
  lost: {
    badge: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    text: "text-red-700",
    label: "Lost",
  },
};

const FALLBACK: StatusStyle = {
  badge: "bg-slate-100 text-slate-500 border border-slate-200",
  dot: "bg-slate-400",
  text: "text-slate-500",
  label: "",
};

export function statusStyle(status: string, overdue = false): StatusStyle {
  const key = overdue ? "overdue" : (status ?? "").toLowerCase();
  const s = STYLES[key] ?? FALLBACK;
  return { ...s, label: s.label || (status ? capitalize(status) : "—") };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
