/**
 * Returns the current calendar year (e.g. 2026).
 *
 * Centralizes the "current year" logic in a single place so widgets
 * (footer copyright, "Matrículas abiertas" badges, etc.) don't each
 * inline `new Date().getFullYear()`.
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}
