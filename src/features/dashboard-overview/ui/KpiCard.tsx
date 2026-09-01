import Link from "next/link";
import { Icon } from "@iconify/react";

import Sparkline from "./Sparkline";
import TrendChip from "./TrendChip";
import { kpiCardVariants } from "./KpiCard.variants";
import type { IKpiCardProps } from "./KpiCard.types";

function formatValue(kpi: IKpiCardProps["kpi"]) {
  if (kpi.format === "currency") {
    return new Intl.NumberFormat("es", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(kpi.value);
  }
  return new Intl.NumberFormat("es").format(kpi.value);
}

export default function KpiCard({ kpi, variant = "hero" }: IKpiCardProps) {
  const tone = kpi.tone ?? "primary";
  const { base, glow } = kpiCardVariants({ variant, tone });

  if (variant === "compact") {
    return (
      <Link href={kpi.href} className="group block h-full">
        <div className={base()}>
          <div className="flex items-center gap-3 p-4">
            <div className="size-10 rounded-xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.9),inset_2px_2px_4px_rgba(169,146,125,0.22)] dark:shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.04),inset_2px_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center text-primary shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Icon icon={kpi.icon} className="size-4.5" aria-hidden="true" />
            </div>
            <p className="min-w-0 flex-1 truncate text-xs font-medium text-muted-foreground">{kpi.label}</p>
            {kpi.pill ? (
              <span className="rounded-full bg-background border border-destructive/30 px-2 py-0.5 text-[10px] font-bold text-destructive shadow-xs">
                {kpi.pill}
              </span>
            ) : null}
            <div className="flex shrink-0 items-center gap-2">
              <p className="font-heading text-base font-bold text-foreground">{formatValue(kpi)}</p>
              <TrendChip trend={kpi.trend} />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={kpi.href} className="group block h-full">
      <div className={base()}>
        <div aria-hidden="true" className={glow()} />
        <div className="relative flex flex-col gap-4 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="truncate text-xs uppercase tracking-wider font-bold text-muted-foreground">{kpi.label}</p>
              {kpi.pill ? (
                <span className="rounded-full bg-background border border-white/60 dark:border-white/5 shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(169,146,125,0.15)] dark:shadow-[-1px_-1px_3px_rgba(255,255,255,0.02),1px_1px_3px_rgba(0,0,0,0.4)] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                  {kpi.pill}
                </span>
              ) : null}
            </div>
            <div className="size-12 rounded-2xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.9),inset_2px_2px_5px_rgba(169,146,125,0.22)] dark:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.04),inset_2px_2px_5px_rgba(0,0,0,0.6)] flex items-center justify-center text-primary shrink-0 transition-transform duration-300 group-hover:scale-110">
              <Icon icon={kpi.icon} className="size-5" aria-hidden="true" />
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 pt-1">
            <div className="space-y-1">
              <p className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{formatValue(kpi)}</p>
              <div className="flex items-center gap-2">
                <TrendChip trend={kpi.trend} />
                {kpi.trendLabel ? <span className="text-[11px] font-light text-muted-foreground">{kpi.trendLabel}</span> : null}
              </div>
            </div>

            {kpi.spark ? (
              <div className="shrink-0">
                <Sparkline data={kpi.spark} tone={tone} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
