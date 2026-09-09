import type { IRevenueTooltipProps } from "./RevenueTooltip.types";

export default function RevenueTooltip({ active, payload, label }: IRevenueTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-popover px-3.5 py-2 text-xs shadow-lg">
      <p className="font-bold capitalize text-foreground">{label}</p>
      <p className="mt-0.5 font-heading text-sm font-bold text-foreground">
        ${payload[0].value.toLocaleString("es", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}
