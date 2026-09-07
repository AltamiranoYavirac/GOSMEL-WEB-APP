"use client";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Card,
  CardContent,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type IAdminColumn,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useStudentAttendance } from "../hooks/useStudentAttendance";
import { useStudentGrades } from "../hooks/useStudentGrades";
import { useStudentPortal } from "../hooks/useStudentPortal";
import {
  ASISTENCIA_ESTADO_BADGE,
  EVALUACION_TIPO_BADGE,
  type IStudentAsistencia,
  type IStudentCalificacion,
} from "../model/student-dashboard.types";

import StudentNoStudents from "./StudentNoStudents";

function calificacionColumns(): IAdminColumn<IStudentCalificacion>[] {
  return [
    {
      key: "titulo",
      label: "Evaluación",
      render: (row) => <span className="font-medium">{row.titulo}</span>,
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (row) => (
        <Badge variant={EVALUACION_TIPO_BADGE[row.tipo].variant}>{EVALUACION_TIPO_BADGE[row.tipo].label}</Badge>
      ),
    },
    {
      key: "catedra",
      label: "Cátedra",
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.catedra}</span>,
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => (row.fecha ? formatDate(row.fecha) : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "nota",
      label: "Nota",
      render: (row) => (
        <span className={row.nota != null && row.nota >= (row.notaMaxima * 0.7) ? "font-semibold text-foreground" : "font-semibold text-destructive"}>
          {row.nota != null ? `${row.nota.toFixed(1)} / ${row.notaMaxima}` : "—"}
        </span>
      ),
    },
    {
      key: "observacion",
      label: "Feedback del docente",
      render: (row) =>
        row.observacion ? <span className="line-clamp-2 text-xs text-muted-foreground">{row.observacion}</span> : <span className="text-muted-foreground">—</span>,
    },
  ];
}

function asistenciaColumns(): IAdminColumn<IStudentAsistencia>[] {
  return [
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => <span className="font-medium">{formatDate(row.fecha)}</span>,
    },
    {
      key: "catedra",
      label: "Cátedra",
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.catedra}</span>,
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={ASISTENCIA_ESTADO_BADGE[row.estado].variant}>{ASISTENCIA_ESTADO_BADGE[row.estado].label}</Badge>
      ),
    },
    {
      key: "observacion",
      label: "Observación",
      render: (row) =>
        row.observacion ? <span className="text-xs text-muted-foreground">{row.observacion}</span> : <span className="text-muted-foreground">—</span>,
    },
  ];
}

export default function StudentGradesView() {
  const { isLoading, estudianteActivo } = useStudentPortal();
  const { data: calificaciones, isPending: notasPending } = useStudentGrades(estudianteActivo?.id ?? null);
  const { data: asistencia, isPending: asistenciaPending } = useStudentAttendance(estudianteActivo?.id ?? null);

  if (!isLoading && !estudianteActivo) {
    return <StudentNoStudents />;
  }

  if (isLoading || notasPending || asistenciaPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Portal · Estudiante"
        title="Notas y asistencia"
        description="Tu desempeño académico y tu puntualidad en clase."
        icon="ph:exam"
      />

      <Tabs defaultValue="notas">
        <TabsList>
          <TabsTrigger value="notas">Boletín de notas</TabsTrigger>
          <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
        </TabsList>

        <TabsContent value="notas" className="pt-2">
          <AdminDataTable
            data={calificaciones ?? []}
            columns={calificacionColumns()}
            loading={false}
            keyId={(row) => row.id}
            searchKeys={[(row) => row.titulo, (row) => row.catedra]}
            emptyTitle="Sin calificaciones"
            emptyDescription="Cuando el docente publique notas, aparecerán aquí."
            countLabel="evaluaciones"
          />
        </TabsContent>

        <TabsContent value="asistencia" className="pt-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="py-4">
                <p className="text-xs text-muted-foreground">Porcentaje de asistencia</p>
                <p className="font-heading text-2xl font-semibold text-foreground">{asistencia?.porcentajeAsistencia ?? 0}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <p className="text-xs text-muted-foreground">Presentes</p>
                <p className="font-heading text-2xl font-semibold text-foreground">{asistencia?.presentes ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <p className="text-xs text-muted-foreground">Atrasos</p>
                <p className="font-heading text-2xl font-semibold text-primary">{asistencia?.atrasos ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <p className="text-xs text-muted-foreground">Ausencias / Justificados</p>
                <p className="font-heading text-2xl font-semibold text-destructive">
                  {asistencia?.ausentes ?? 0} / {asistencia?.justificados ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4">
            <AdminDataTable
              data={asistencia?.items ?? []}
              columns={asistenciaColumns()}
              loading={false}
              keyId={(row) => row.sesionId}
              emptyTitle="Sin asistencias"
              emptyDescription="El historial de asistencia aparecerá aquí."
              countLabel="registros"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}