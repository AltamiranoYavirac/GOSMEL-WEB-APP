"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { AdminPageHeader, Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useStudentCatedras } from "../hooks/useStudentCatedras";
import { useStudentPortal } from "../hooks/useStudentPortal";
import { useStudentPracticeLogs } from "../hooks/useStudentPracticeLogs";
import RegistrarPracticaDialog from "./RegistrarPracticaDialog";
import StudentNoStudents from "./StudentNoStudents";
import StudentPracticeChart from "./StudentPracticeChart";
import StudentStatCard from "./StudentStatCard";

function formatoMinutos(minutos: number): string {
  if (minutos >= 60) {
    const horas = Math.floor(minutos / 60);
    const restante = minutos % 60;
    return restante > 0 ? `${horas}h ${restante}m` : `${horas}h`;
  }
  return `${minutos} min`;
}

export default function StudentPracticeView() {
  const { isLoading, estudianteActivo } = useStudentPortal();
  const { data: practice, isPending } = useStudentPracticeLogs(estudianteActivo?.id ?? null);
  const { data: catedras } = useStudentCatedras(estudianteActivo?.id ?? null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!isLoading && !estudianteActivo) {
    return <StudentNoStudents />;
  }

  if (isLoading || isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const totalMinutos = (practice?.logs ?? []).reduce((acc, log) => acc + log.minutos, 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Portal · Estudiante"
        title="Mi práctica"
        description="Registra tu estudio diario y construye tu racha musical."
        icon="ph:guitar"
      >
        <Button onClick={() => setDialogOpen(true)}>
          <Icon icon="ph:plus" aria-hidden="true" />
          Registrar práctica
        </Button>
      </AdminPageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StudentStatCard icon="ph:flame" label="Racha de práctica" value={`${practice?.rachaDias ?? 0} días`} />
        <StudentStatCard icon="ph:timer" label="Total practicado" value={formatoMinutos(totalMinutos)} />
        <StudentStatCard icon="ph:list-checks" label="Sesiones registradas" value={String(practice?.logs.length ?? 0)} />
      </div>

      <StudentPracticeChart data={practice?.semana ?? []} />

      <Card>
        <CardHeader>
          <CardTitle>Historial de práctica</CardTitle>
        </CardHeader>
        <CardContent>
          {(practice?.logs ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no has registrado sesiones de práctica.</p>
          ) : (
            <ul className="space-y-2">
              {(practice?.logs ?? []).map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-3 rounded-lg border border-accent-muted/40 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(log.fecha)}
                      {log.catedra ? <span className="ml-2 font-mono text-xs font-semibold text-primary">{log.catedra}</span> : null}
                    </p>
                    {log.nota ? <p className="truncate text-xs text-muted-foreground">{log.nota}</p> : null}
                  </div>
                  <span className="shrink-0 font-mono text-sm font-semibold text-primary">{formatoMinutos(log.minutos)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {estudianteActivo ? (
        <RegistrarPracticaDialog
          estudianteId={estudianteActivo.id}
          inscripciones={catedras ?? []}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      ) : null}
    </div>
  );
}