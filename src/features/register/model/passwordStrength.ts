export type TPasswordStrengthScore = 0 | 1 | 2 | 3 | 4

export interface IPasswordStrength {
  score: TPasswordStrengthScore
  label: string
}

const STRENGTH_LABELS: Record<TPasswordStrengthScore, string> = {
  0: "Muy débil",
  1: "Débil",
  2: "Aceptable",
  3: "Fuerte",
  4: "Muy fuerte",
}

export function getPasswordStrength(value: string): IPasswordStrength {
  if (!value) {
    return { score: 0, label: STRENGTH_LABELS[0] }
  }

  let score = 0
  if (value.length >= 8) score += 1
  if (/[A-Z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1

  const clamped = Math.min(score, 4) as TPasswordStrengthScore
  return { score: clamped, label: STRENGTH_LABELS[clamped] }
}
