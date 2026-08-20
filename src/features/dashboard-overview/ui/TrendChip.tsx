import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";

import type { ITrendChipProps } from "./TrendChip.types";

export default function TrendChip({ trend, label }: ITrendChipProps) {
  if (trend === undefined) return null;

  const positive = trend >= 0;
  const formatted = new Intl.NumberFormat("es", { maximumFractionDigits: 1 }).format(Math.abs(trend));

  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span
        className={cn(
          "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
          positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}
      >
        <Icon icon={positive ? "ph:trend-up" : "ph:trend-down"} width={12} height={12} aria-hidden="true" />
        {positive ? "+" : "−"}
        {formatted}%
      </span>
      {label ? <span className="text-muted-foreground">{label}</span> : null}
    </span>
  );
}
