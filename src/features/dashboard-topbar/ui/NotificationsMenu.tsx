"use client";

import { Icon } from "@iconify/react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from "@/shared/ui";

import { useTopbarSummary } from "../hooks/useTopbarSummary";
import ActivityRow from "./ActivityRow";
import NotificationSection from "./NotificationSection";

export default function NotificationsMenu() {
  const summary = useTopbarSummary();
  const counts = summary.data?.counts;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Notificaciones">
          <span className="relative inline-flex">
            <Icon icon="ph:bell" width={20} height={20} aria-hidden="true" />
            {counts && counts.totalPendientes > 0 ? (
              <span
                aria-hidden="true"
                className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-500 px-1 text-[9px] font-bold leading-none text-primary-foreground ring-2 ring-background"
              >
                {counts.totalPendientes > 99 ? "99+" : counts.totalPendientes}
              </span>
            ) : null}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {summary.isPending ? (
          <div className="space-y-2 p-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : counts && counts.totalPendientes === 0 && summary.data?.activities.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">No hay nada pendiente.</p>
        ) : (
          <>
            {counts && counts.totalPendientes > 0 ? (
              <div className="space-y-0.5 p-1.5">
                {counts.solicitudesPendientes > 0 ? (
                  <NotificationSection
                    icon="ph:tray"
                    label="Solicitudes nuevas"
                    count={counts.solicitudesPendientes}
                    href="/dashboard/admin/solicitudes"
                    tone="violet"
                  />
                ) : null}
                {counts.cuotasVencidas > 0 ? (
                  <NotificationSection
                    icon="ph:receipt"
                    label="Cuotas vencidas"
                    count={counts.cuotasVencidas}
                    href="/dashboard/admin/cuotas"
                    tone="destructive"
                  />
                ) : null}
                {counts.inscripcionesPendientes > 0 ? (
                  <NotificationSection
                    icon="ph:user-plus"
                    label="Inscripciones por aprobar"
                    count={counts.inscripcionesPendientes}
                    href="/dashboard/admin/catedras"
                    tone="primary"
                  />
                ) : null}
                {counts.sesionesHoy > 0 ? (
                  <NotificationSection
                    icon="ph:calendar-blank"
                    label="Sesiones programadas hoy"
                    count={counts.sesionesHoy}
                    href="/dashboard/admin/horarios"
                    tone="secondary"
                  />
                ) : null}
              </div>
            ) : null}

            {summary.data && summary.data.activities.length > 0 ? (
              <>
                <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actividad reciente
                </DropdownMenuLabel>
                <ul>
                  {summary.data.activities.map((activity) => (
                    <ActivityRow key={activity.id} activity={activity} />
                  ))}
                </ul>
              </>
            ) : null}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
