import Link from "next/link";
import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";

import TrendChip from "./TrendChip";
import { ACCENT_TONE_SPARK } from "../model/accent-tone";
import { kpiCardVariants } from "./KpiCard.variants";
import type { IKpiCardProps } from "./KpiCard.types";

function formatValue(kpi: IKpiCardProps["kpi"]) {
  if (kpi.format === "currency") {
    return new Intl.NumberFormat("es", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(kpi.value);
  }
  return new Intl.NumberFormat("es").format(kpi.value);
}

export default function KpiCard({ kpi }: IKpiCardProps) {
  const tone = kpi.tone ?? "neutral";
  const accented = Boolean(kpi.pill) || tone === "warning" || tone === "danger";
  const { base, tile } = kpiCardVariants({ tone, accented });

  return (
    <div className={base()}>
      <span className={tile()}>
        <Icon icon={kpi.icon} className="size-16" aria-hidden="true" />
      </span>

      <div className="relative z-10 text-sm font-semibold text-muted-foreground">{kpi.label}</div>

      <div className="relative z-10 mt-3 font-heading text-[1.8125rem] font-extrabold tracking-[-0.03em] text-foreground">
        {formatValue(kpi)}
      </div>

      <div className="relative z-10 mt-auto pt-4">
        {kpi.trend !== undefined ? (
          <TrendChip trend={kpi.trend} label={kpi.trendLabel} />
        ) : (
          <Link
            href={kpi.href}
            className={cn(
              "inline-flex items-center gap-1 text-[0.75rem] font-bold transition-transform hover:translate-x-0.5",
              ACCENT_TONE_SPARK[tone]
            )}
          >
            Ver detalle
            <Icon icon="ph:arrow-right" width={12} height={12} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
