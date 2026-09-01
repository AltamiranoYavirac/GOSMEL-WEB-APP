"use client";

import { Icon } from "@iconify/react";

import { AdminDataTable, AdminPageHeader, Badge, Button, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useEvaluaciones } from "../hooks/useEvaluaciones";
import { useEliminarEvaluacion } from "../hooks/useEliminarEvaluacion";
import { TIPO_EVALUACION_BADGE, type IEvaluacionRow } from "../model/evaluacion.types";
import CrearEvaluacionDialog from "./CrearEvaluacionDialog";
import CalificarEvaluacionSheet from "./CalificarEvaluacionSheet";

export default function EvaluacionesList() {
  const { data, isPending } = useEvaluaciones();
  const eliminar = useEliminarEvaluacion();
  const rows = data ?? [];

  const columns: IAdminColumn<IEvaluacionRow>[] = [
    {
      key: "titulo",
      label: "Evaluación",
      render: (row) => <span className="font-medium">{row.titulo}</span>,
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (row) => (
        <Badge variant={TIPO_EVALUACION_BADGE[row.tipo].variant}>{TIPO_EVALUACION_BADGE[row.tipo].label}</Badge>
      ),
    },
    {
      key: "catedra",
      label: "Cátedra",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs font-semibold text-primary">{row.catedra}</span>
          <span className="text-xs text-muted-foreground">{row.curso}</span>
        </div>
      ),
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => (row.fecha ? formatDate(row.fecha) : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "ponderacion",
      label: "Ponderación",
      render: (row) => `${row.ponderacion}%`,
    },
    {
      key: "notaMaxima",
      label: "Nota máx.",
      render: (row) => row.notaMaxima,
    },
    {
      key: "promedio",
      label: "Promedio",
      render: (row) =>
        row.promedio != null ? (
          <span className="font-semibold text-primary">{row.promedio.toFixed(2)}</span>
        ) : (
          <span className="text-muted-foreground">Sin calificar</span>
        ),
    },
  ];

  const filters: IAdminDataTableFilter<IEvaluacionRow>[] = [
    { value: "diagnostica", label: "Diagnósticas", match: (row) => row.tipo === "diagnostica" },
    { value: "formativa", label: "Formativas", match: (row) => row.tipo === "formativa" },
    { value: "sumativa", label: "Sumativas", match: (row) => row.tipo === "sumativa" },
    { value: "examen", label: "Exámenes", match: (row) => row.tipo === "examen_practico" || row.tipo === "examen_teorico" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          eyebrow="Académico · GOSMEL"
          title="Evaluaciones"
          description="Evaluaciones por cátedra o sesión y las calificaciones de los estudiantes."
          icon="ph:exam"
        />
        <CrearEvaluacionDialog />
      </div>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.titulo, (row) => row.catedra, (row) => row.curso]}
        filters={filters}
        emptyTitle="Sin evaluaciones"
        emptyDescription="Cuando se creen evaluaciones aparecerán aquí."
        countLabel="evaluaciones"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <CalificarEvaluacionSheet evaluacion={row} />
            <Button
              size="icon-xs"
              variant="ghost"
              disabled={eliminar.isPending}
              onClick={() => eliminar.mutate(row.id)}
              aria-label={`Eliminar evaluación ${row.titulo}`}
            >
              <Icon icon="ph:trash" className="size-4 text-muted-foreground hover:text-destructive" aria-hidden="true" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}