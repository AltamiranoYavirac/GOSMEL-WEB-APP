import { Icon } from "@iconify/react";

import { Badge } from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { SESION_ESTADO_BADGE } from "../model/student-dashboard.types";
import type { IStudentSesionRowProps } from "./StudentSesionRow.types";

export default function StudentSesionRow({ sesion, proxima }: IStudentSesionRowProps) {
  const badge =
    SESION_ESTADO_BADGE[sesion.estado as keyof typeof SESION_ESTADO_BADGE] ?? {
      label: sesion.estado,
      variant: "outline" as const,
    };

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-accent-muted/40 px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <Icon
          icon={proxima ? "ph:calendar" : "ph:check-square"}
          className="size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
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
