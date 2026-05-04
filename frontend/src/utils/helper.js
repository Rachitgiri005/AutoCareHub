export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

export const statusBadge = (s = "") => {
  const map = {
    Pending:      "badge-pending",
    Confirmed:    "badge-confirmed",
    "In Progress":"badge-in-progress",
    Completed:    "badge-completed",
    Cancelled:    "badge-cancelled",
    Paid:         "badge-paid",
    Unpaid:       "badge-unpaid",
    Partial:      "badge-partial",
  };
  return map[s] || "badge-pending";
};

export const stars = (n) => "⭐".repeat(Math.round(n || 0));

export const ALL_SLOTS = [
  "09:00 AM","10:00 AM","11:00 AM","12:00 PM",
  "01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM",
];