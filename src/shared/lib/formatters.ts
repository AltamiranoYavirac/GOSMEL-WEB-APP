const CURRENCY = new Intl.NumberFormat("es", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const DATE = new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric" });

const DATE_TIME = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const MONTH_PERIOD = new Intl.DateTimeFormat("es", { month: "long", year: "numeric" });

export function formatCurrency(value: number | null | undefined): string {
  return CURRENCY.format(value ?? 0);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return DATE.format(new Date(value));
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  return DATE_TIME.format(new Date(value));
}

export function formatMonthPeriod(periodo: string): string {
  const [year, month] = periodo.split("-").map(Number);
  if (!year || !month) return periodo;
  return MONTH_PERIOD.format(new Date(year, month - 1, 1));
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}