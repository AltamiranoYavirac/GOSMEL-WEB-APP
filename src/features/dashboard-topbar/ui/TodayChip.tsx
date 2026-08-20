"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button, Skeleton } from "@/shared/ui";

import { useTopbarSummary } from "../hooks/useTopbarSummary";

export default function TodayChip() {
  const summary = useTopbarSummary();
  const counts = summary.data?.counts;

  if (summary.isPending) {
    return <Skeleton className="hidden h-9 w-48 rounded-lg md:block" />;
  }

  if (!counts) return null;

  const parts: string[] = [];
  if (counts.sesionesHoy > 0) parts.push(`${counts.sesionesHoy} ${counts.sesionesHoy === 1 ? "sesión" : "sesiones"}`);
  if (counts.cuotasVencidas > 0) parts.push(`${counts.cuotasVencidas} ${counts.cuotasVencidas === 1 ? "vencida" : "vencidas"}`);
  const label = parts.length > 0 ? `Hoy: ${parts.join(" · ")}` : "Hoy: sin pendientes";

  return (
    <Button asChild variant="outline" size="default" className="hidden h-9 gap-2 px-3 md:inline-flex">
      <Link href="/dashboard/admin/horarios">
        <Icon icon="ph:calendar-dots" width={16} height={16} className="text-muted-foreground" aria-hidden="true" />
        <span className="text-muted-foreground">{label}</span>
        {counts.cuotasVencidas > 0 ? (
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-destructive" />
        ) : null}
      </Link>
    </Button>
  );
}
