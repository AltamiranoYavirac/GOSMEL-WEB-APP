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

import { useTeacherEvaluaciones } from "../hooks/useTeacherEvaluaciones";
import {
  EVALUACION_TIPO_BADGE,
  type ITeacherEvaluacion,
} from "../model/teacher-dashboard.types";
import CalificarEvaluacionTeacherSheet from "./CalificarEvaluacionTeacherSheet";
import CrearEvaluacionTeacherDialog from "./CrearEvaluacionTeacherDialog";
import type { ITeacherEvaluacionesViewProps } from "./TeacherEvaluacionesView.types";

export default function TeacherEvaluacionesView({ className }: ITeacherEvaluacionesViewProps) {
  const { data = [], isPending } = useTeacherEvaluaciones();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedEvaluacionId, setSelectedEvaluacionId] = useState<string | null>(null);

  const columns: IAdminColumn<ITeacherEvaluacion>[] = [
    {
      key: "titulo",
      label: "Evaluación",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-xs text-foreground">{row.titulo}</span>
          <span className="text-[11px] text-muted-foreground">{row.curso}</span>
        </div>
      ),
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (row) => (
        <Badge variant={EVALUACION_TIPO_BADGE[row.tipo].variant}>
          {EVALUACION_TIPO_BADGE[row.tipo].label}
        </Badge>
      ),
    },
    {
      key: "catedra",
      label: "Cátedra",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary">{row.catedra}</span>
      ),
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.fecha ? formatDate(row.fecha) : "—"}
        </span>
      ),
    },
    {
      key: "ponderacion",
      label: "Ponderación",
      render: (row) => (
        <span className="font-mono text-xs text-foreground">{row.ponderacion}%</span>
      ),
    },
    {
      key: "promedio",
      label: "Promedio",
      render: (row) =>
        row.promedio != null ? (
          <span className="font-medium text-xs text-foreground">
            {row.promedio} / {row.notaMaxima}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Sin calificar</span>
        ),
    },
    {
      key: "avance",
      label: "Calificados",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.rendidas} de {row.totalEstudiantes}
        </span>
      ),
    },
    {
      key: "acciones",
      label: "Calificar",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedEvaluacionId(row.id)}
          className="flex items-center gap-1.5"
        >
          <Icon icon="ph:pencil-simple-line" className="size-4 text-primary" />
          Calificar
        </Button>
      ),
    },
  ];

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      <AdminPageHeader
        eyebrow="Portal · Docente"
        title="Evaluaciones y Calificaciones"
        description="Planifica evaluaciones para tus cátedras, registra notas individuales y lleva el seguimiento del rendimiento de tus estudiantes."
        icon="ph:exam"
      >
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Icon icon="ph:plus-circle" className="size-4" />
          Nueva Evaluación
        </Button>
      </AdminPageHeader>

      <AdminDataTable
        data={data}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.titulo, (row) => row.catedra, (row) => row.curso]}
        emptyTitle="Sin evaluaciones registradas"
        emptyDescription="Puedes crear una evaluación haciendo clic en 'Nueva Evaluación'."
        countLabel="evaluaciones"
      />

      <CrearEvaluacionTeacherDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {selectedEvaluacionId ? (
        <CalificarEvaluacionTeacherSheet
          evaluacionId={selectedEvaluacionId}
          open={Boolean(selectedEvaluacionId)}
          onOpenChange={(open) => {
            if (!open) setSelectedEvaluacionId(null);
          }}
        />
      ) : null}
    </div>
  );
}
