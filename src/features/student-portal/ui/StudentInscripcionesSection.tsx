import { Badge, Card, CardContent, Progress, Skeleton } from "@/shared/ui";

import { DIAS_SEMANA, INSCRIPCION_ESTADO_BADGE } from "../model/student-dashboard.types";
import type { IStudentInscripcionesSectionProps } from "./StudentInscripcionesSection.types";

export default function StudentInscripcionesSection({
  catedras,
  loading,
}: IStudentInscripcionesSectionProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-40 rounded" />
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      </div>
    );
  }

  if (catedras.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <p className="text-sm text-muted-foreground">No estás inscrito aún en ninguna cátedra.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mis inscripciones</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {catedras.map((catedra) => {
          const badge = INSCRIPCION_ESTADO_BADGE[catedra.estado];

          return (
            <Card key={catedra.inscripcionId}>
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-heading text-base font-semibold text-foreground">{catedra.curso}</p>
                    <p className="font-mono text-xs font-semibold text-primary">{catedra.codigo}</p>
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>

                {catedra.docente ? <p className="text-xs text-muted-foreground">Docente: {catedra.docente}</p> : null}

                {catedra.horarios.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {catedra.horarios.map((horario, index) => (
                      <span key={index} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {DIAS_SEMANA[horario.dia]} {horario.inicio.slice(0, 5)}–{horario.fin.slice(0, 5)}
                      </span>
                    ))}
                  </div>
                ) : null}

                {catedra.estado === "activa" ? (
                  <div className="flex items-center gap-2">
                    <Progress value={catedra.progresoPct} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground">{catedra.progresoPct}%</span>
                  </div>
                ) : catedra.estado === "pendiente" ? (
                  <p className="text-xs text-muted-foreground">Tu matrícula está en revisión.</p>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}