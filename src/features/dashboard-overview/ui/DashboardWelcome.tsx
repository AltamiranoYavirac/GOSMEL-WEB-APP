import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui";
import type { IDashboardWelcomeProps } from "./DashboardWelcome.types";

const TODAY = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default function DashboardWelcome({ adminName, solicitudesPendientes }: IDashboardWelcomeProps) {
  const fecha = TODAY.format(new Date());

  return (
    <section className="relative overflow-hidden rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] p-6 sm:p-8">
      <div aria-hidden="true" className="absolute inset-0 bg-staff-lines opacity-30 pointer-events-none" />
      <div aria-hidden="true" className="absolute -right-16 -top-20 size-60 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute -right-4 top-8 size-36 rounded-full bg-secondary/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="capitalize">{fecha}</span>
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Hola, <span className="text-primary">{adminName}</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            Panel general de operaciones, admisiones e indicadores académicos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" className="rounded-2xl border-white/60 dark:border-white/5 bg-background shadow-[-2px_-2px_6px_rgba(255,255,255,0.8),2px_2px_6px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_6px_rgba(255,255,255,0.03),2px_2px_6px_rgba(0,0,0,0.5)] text-xs uppercase tracking-wider font-bold">
            <Link href="/dashboard/admin/catedras">
              <Icon icon="ph:plus-bold" width={14} height={14} aria-hidden="true" />
              Nueva cátedra
            </Link>
          </Button>
          <Button asChild className="rounded-2xl shadow-lg shadow-primary/25 text-xs uppercase tracking-wider font-bold">
            <Link href="/dashboard/admin/solicitudes">
              <Icon icon="ph:tray-bold" width={14} height={14} aria-hidden="true" />
              Solicitudes
              {solicitudesPendientes > 0 ? (
                <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 font-mono text-[10px] font-bold leading-none">
                  {solicitudesPendientes}
                </span>
              ) : null}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
