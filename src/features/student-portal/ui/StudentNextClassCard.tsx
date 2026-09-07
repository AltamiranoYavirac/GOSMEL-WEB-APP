import { Icon } from "@iconify/react";

import { Badge, Card, CardContent } from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { MODALIDAD_CURSO_LABEL } from "../model/student-dashboard.types";
import type { IStudentNextClassCardProps } from "./StudentNextClassCard.types";

export default function StudentNextClassCard({ data }: IStudentNextClassCardProps) {
  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-5">
          <Icon icon="ph:calendar-blank" className="size-5 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">No tienes clases programadas próximamente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
            <Icon icon="ph:calendar" className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Próxima clase</p>
            <p className="font-heading text-lg font-semibold text-foreground">
              {formatDate(data.fecha)}
              {data.horaInicio ? ` · ${data.horaInicio.slice(0, 5)}` : ""}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {data.curso} — <span className="font-mono font-semibold text-primary">{data.catedra}</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          <Badge variant="outline">{MODALIDAD_CURSO_LABEL[data.modalidad]}</Badge>
          {data.docente ? <p className="text-xs text-muted-foreground">{data.docente}</p> : null}
          {data.aula ? <p className="text-xs text-muted-foreground">Aula {data.aula}</p> : null}
        </div>

        {data.tema ? <p className="w-full text-xs italic text-muted-foreground">Tema: {data.tema}</p> : null}
      </CardContent>
    </Card>
  );
}