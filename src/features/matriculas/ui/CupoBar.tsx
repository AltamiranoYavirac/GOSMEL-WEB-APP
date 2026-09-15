"use client";

import { cn } from "@/shared/lib/utils";

interface ICupoBarProps {
  ocupados: number;
  maximo: number | null;
  className?: string;
}

export function cupoPorcentaje(ocupados: number, maximo: number | null): number | null {
  if (maximo === null || maximo <= 0) return null;
  return Math.min(100, Math.round((ocupados / maximo) * 100));
}

export default function CupoBar({ ocupados, maximo, className }: ICupoBarProps) {
  const pct = cupoPorcentaje(ocupados, maximo);
  if (pct === null || maximo === null) return null;

  const lleno = ocupados >= maximo;
  const casiLleno = !lleno && pct >= 80;

  return (
    <span className={cn("block min-w-0", className)}>
      <span
        className="block h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Cupo ocupado al ${pct} por ciento`}
      >
        <span
          className={cn(
            "block h-full rounded-full transition-all",
            lleno ? "bg-destructive" : casiLleno ? "bg-warning" : "bg-primary"
          )}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span
        className={cn(
          "mt-1.5 block font-mono text-xs leading-none",
          lleno ? "font-bold text-destructive" : casiLleno ? "font-semibold text-warning-fg" : "text-muted-foreground"
        )}
      >
        {lleno ? `Cupo lleno · ${ocupados}/${maximo}` : `Cupo ${ocupados} de ${maximo} · ${pct}%`}
      </span>
    </span>
  );
}
