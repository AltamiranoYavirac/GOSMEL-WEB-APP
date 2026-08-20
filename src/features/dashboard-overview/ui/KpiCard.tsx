import Link from "next/link";

import { Card, CardContent, IconTile } from "@/shared/ui";

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
  const { base, glow, tile } = kpiCardVariants({ variant, tone });

  if (variant === "compact") {
    return (
      <Link href={kpi.href} className="group">
        <Card size="sm" className="h-full transition-colors group-hover:bg-accent-muted/40">
          <CardContent className="flex items-center gap-3">
            <IconTile icon={kpi.icon} size="sm" iconSize={18} className={tile()} />
            <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{kpi.label}</p>
            {kpi.pill ? (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                {kpi.pill}
              </span>
            ) : null}
            <div className="flex shrink-0 items-center gap-2">
              <p className="font-heading text-lg font-semibold text-foreground">{formatValue(kpi)}</p>
              <TrendChip trend={kpi.trend} />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={kpi.href} className="group">
      <Card className={base()}>
        <div aria-hidden="true" className={glow()} />
        <CardContent className="relative flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <p className="truncate text-sm text-muted-foreground">{kpi.label}</p>
              {kpi.pill ? (
                <span className="rounded-full bg-secondary-100 px-2 py-0.5 text-[11px] font-semibold text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300">
                  {kpi.pill}
                </span>
              ) : null}
            </div>
            <IconTile icon={kpi.icon} className={tile()} />
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-heading text-3xl font-semibold tracking-tight text-foreground">{formatValue(kpi)}</p>
              <div className="mt-1.5">
                <TrendChip trend={kpi.trend} label={kpi.trendLabel} />
              </div>
            </div>
            {kpi.spark ? <Sparkline data={kpi.spark} tone={tone} /> : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
