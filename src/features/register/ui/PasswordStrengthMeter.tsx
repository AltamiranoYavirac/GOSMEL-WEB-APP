import { cn } from "@/shared/lib/utils"
import { getPasswordStrength } from "../model/passwordStrength"
import type { IPasswordStrengthMeterProps } from "./PasswordStrengthMeter.types"

const SEGMENT_COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-secondary-500",
  "bg-primary-500",
] as const

export default function PasswordStrengthMeter({ value }: IPasswordStrengthMeterProps) {
  if (!value) return null

  const { score, label } = getPasswordStrength(value)

  return (
    <div className="-mt-2 flex flex-col gap-1.5 px-1">
      <div className="flex gap-1.5">
        {SEGMENT_COLORS.map((color, index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full bg-muted transition-colors",
              index < score && color
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
