export function formatActivityMeta(date: Date): string {
  return date.toLocaleDateString("es", { day: "numeric", month: "short" });
}

export function formatActivitySubtitleDate(date: Date): string {
  return date.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
}

export function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "G";
  const first = parts[0].charAt(0);
  const second = parts.length > 1 ? parts[1].charAt(0) : parts[0].charAt(1) || "";
  return `${first}${second}`.toUpperCase();
}
