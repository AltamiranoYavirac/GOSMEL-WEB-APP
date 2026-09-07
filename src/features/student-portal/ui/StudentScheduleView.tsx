import { Icon } from "@iconify/react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { SESION_ESTADO_BADGE } from "../model/student-dashboard.types";
import type { IStudentScheduleViewProps } from "./StudentScheduleView.types";

function SesionFila({ sesion, proxima }: { sesion: { fecha: string; horaInicio: string | null; tema: string | null; estado: string; catedra: string; curso: string }; proxima: boolean }) {
  const badge = SESION_ESTADO_BADGE[sesion.estado as keyof typeof SESION_ESTADO_BADGE] ?? { label: sesion.estado, variant: "outline" as const };

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-accent-muted/40 px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <Icon icon={proxima ? "ph:calendar" : "ph:check-square"} className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            {formatDate(sesion.fecha)}
            {sesion.horaInicio ? ` · ${sesion.horaInicio.slice(0, 5)}` : ""}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            <span className="font-mono font-semibold text-primary">{sesion.catedra}</span> · {sesion.curso}
            {sesion.tema ? ` — ${sesion.tema}` : ""}
          </p>
        </div>
      </div>
      <Badge variant={badge.variant}>{badge.label}</Badge>
    </li>
  );
}

export default function StudentScheduleView({ proximas, pasadas }: IStudentScheduleViewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Próximas clases</CardTitle>
        </CardHeader>
        <CardContent>
          {proximas.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tienes clases próximas programadas.</p>
          ) : (
            <ul className="space-y-2">
              {proximas.map((sesion) => (
                <SesionFila key={sesion.id} sesion={sesion} proxima />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de sesiones</CardTitle>
        </CardHeader>
        <CardContent>
          {pasadas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay sesiones pasadas.</p>
          ) : (
            <ul className="space-y-2">
              {pasadas.map((sesion) => (
                <SesionFila key={sesion.id} sesion={sesion} proxima={false} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}