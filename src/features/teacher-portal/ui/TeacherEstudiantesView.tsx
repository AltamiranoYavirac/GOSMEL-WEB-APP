"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  type IAdminColumn,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useTeacherEstudiantes } from "../hooks/useTeacherEstudiantes";
import type { ITeacherEstudiante } from "../model/teacher-dashboard.types";
import EstudianteAsistenciaSheet from "./EstudianteAsistenciaSheet";
import type { ITeacherEstudiantesViewProps } from "./TeacherEstudiantesView.types";

export default function TeacherEstudiantesView({ className }: ITeacherEstudiantesViewProps) {
  const { data = [], isPending } = useTeacherEstudiantes();
  const [selectedStudent, setSelectedStudent] = useState<{
    inscripcionId: string;
    nombre: string;
    curso: string;
  } | null>(null);

  const columns: IAdminColumn<ITeacherEstudiante>[] = [
    {
      key: "nombre",
      label: "Estudiante",
      render: (row) => (
        <div className="flex min-w-0 flex-col">
          <span className="font-semibold text-foreground">{row.nombre}</span>
          {row.email ? (
            <span className="truncate text-xs text-muted-foreground">{row.email}</span>
          ) : null}
        </div>
      ),
    },
    {
      key: "contacto",
      label: "Contacto",
      render: (row) => (
        <span className="text-xs text-muted-foreground">{row.celular ?? "—"}</span>
      ),
    },
    {
      key: "curso",
      label: "Curso / Cátedra",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">{row.cursoNombre}</span>
          <span className="font-mono text-[10px] text-primary">{row.catedraCodigo}</span>
        </div>
      ),
    },
    {
      key: "fechaInscripcion",
      label: "Fecha Inscripción",
      render: (row) => (
        <span className="text-xs text-muted-foreground">{formatDate(row.fechaInscripcion)}</span>
      ),
    },
    {
      key: "promedio",
      label: "Promedio (10)",
      render: (row) =>
        row.promedioSobre10 != null ? (
          <Badge
            variant={row.promedioSobre10 >= 7 ? "default" : "destructive"}
            className="font-mono text-xs"
          >
            {row.promedioSobre10.toFixed(1)} / 10
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Sin notas</span>
        ),
    },
    {
      key: "asistencia",
      label: "Asistencia",
      render: (row) =>
        row.porcentajeAsistencia != null ? (
          <div className="flex items-center gap-2">
            <Badge
              variant={row.porcentajeAsistencia >= 80 ? "default" : "secondary"}
              className="text-xs"
            >
              {row.porcentajeAsistencia}%
            </Badge>
            <span className="text-[11px] text-muted-foreground">
              ({row.asistenciasPresentes}/{row.totalAsistenciasRegistradas})
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Sin sesiones</span>
        ),
    },
    {
      key: "acciones",
      label: "Historial",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setSelectedStudent({
              inscripcionId: row.inscripcionId,
              nombre: row.nombre,
              curso: row.cursoNombre,
            })
          }
          className="flex items-center gap-1.5"
        >
          <Icon icon="ph:calendar-check" className="size-4 text-primary" />
          Asistencias
        </Button>
      ),
    },
  ];

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      <AdminPageHeader
        eyebrow="Portal · Docente"
        title="Mis Estudiantes"
        description="Estudiantes matriculados en tus cátedras con promedio académico sobre 10 (v_promedio_academico) y seguimiento de asistencia."
        icon="ph:student"
      />

      <AdminDataTable
        data={data}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.inscripcionId}
        searchKeys={[(row) => row.nombre, (row) => row.cursoNombre, (row) => row.catedraCodigo]}
        emptyTitle="Sin estudiantes inscritos"
        emptyDescription="Cuando los alumnos se matriculen en tus cátedras aparecerán en este listado."
        countLabel="estudiantes"
      />

      {selectedStudent ? (
        <EstudianteAsistenciaSheet
          inscripcionId={selectedStudent.inscripcionId}
          estudianteNombre={selectedStudent.nombre}
          cursoNombre={selectedStudent.curso}
          open={Boolean(selectedStudent)}
          onOpenChange={(open) => {
            if (!open) setSelectedStudent(null);
          }}
        />
      ) : null}
    </div>
  );
}
