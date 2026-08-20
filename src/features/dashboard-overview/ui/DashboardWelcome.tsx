import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui";

import type { IDashboardWelcomeProps } from "./DashboardWelcome.types";

const TODAY = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default function DashboardWelcome({ adminName, solicitudesPendientes }: IDashboardWelcomeProps) {
  const fecha = TODAY.format(new Date());

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card-gradient p-6 sm:p-8">
      <div aria-hidden="true" className="absolute inset-0 bg-staff-lines opacity-50" />
      <div aria-hidden="true" className="absolute -right-20 -top-24 size-64 rounded-full bg-violet-500/15 blur-2xl sm:blur-3xl" />
      <div aria-hidden="true" className="absolute -right-4 top-8 size-40 rounded-full bg-primary-500/15 blur-xl sm:blur-2xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium capitalize text-muted-foreground">{fecha}</p>
          <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Hola, {adminName}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">Esto es lo que está pasando hoy en la academia.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/catedras">
              <Icon icon="ph:plus" width={18} height={18} aria-hidden="true" />
              Nueva cátedra
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/admin/solicitudes">
              <Icon icon="ph:tray" width={18} height={18} aria-hidden="true" />
              Solicitudes
              {solicitudesPendientes > 0 ? (
                <span className="ml-1 rounded-full bg-background/25 px-1.5 py-0.5 text-xs font-bold leading-none">
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
