import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle, Progress } from "@/shared/ui";

import type { IStudentCurriculumViewProps } from "./StudentCurriculumView.types";

export default function StudentCurriculumView({ planes }: IStudentCurriculumViewProps) {
  if (planes.length === 0) {
    return <p className="text-sm text-muted-foreground">No tienes temarios disponibles todavía.</p>;
  }

  return (
    <div className="space-y-4">
      {planes.map((plan) => {
        const totalLecciones = plan.modulos.reduce((acc, modulo) => acc + modulo.lecciones.length, 0);
        const completadas = plan.modulos.reduce((acc, modulo) => acc + modulo.lecciones.filter((leccion) => leccion.completada).length, 0);

        return (
          <Card key={plan.cursoId}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>
                  {plan.curso}
                  <span className="ml-2 font-mono text-xs font-semibold text-primary">{plan.catedra}</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {completadas} de {totalLecciones} lecciones completadas
                </p>
              </div>
              <Progress value={plan.progresoPct} className="h-1.5" />
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.modulos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Este curso aún no tiene temario publicado.</p>
              ) : (
                plan.modulos.map((modulo) => (
                  <div key={modulo.id} className="rounded-lg border border-accent-muted/40 p-3">
                    <p className="text-sm font-semibold text-foreground">{modulo.titulo}</p>
                    {modulo.descripcion ? <p className="text-xs text-muted-foreground">{modulo.descripcion}</p> : null}
                    <ul className="mt-2 space-y-1">
                      {modulo.lecciones.map((leccion) => (
                        <li key={leccion.id} className="flex items-center gap-2">
                          <Icon
                            icon={leccion.completada ? "ph:check-circle-fill" : "ph:circle"}
                            className={leccion.completada ? "size-4 text-primary" : "size-4 text-muted-foreground/50"}
                            aria-hidden="true"
                          />
                          <span className={leccion.completada ? "text-sm text-foreground" : "text-sm text-muted-foreground"}>
                            {leccion.titulo}
                          </span>
                          {leccion.duracionMinutos ? (
                            <span className="ml-auto text-xs text-muted-foreground/70">{leccion.duracionMinutos} min</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}