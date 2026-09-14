"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type IAdminColumn,
  type IAdminDataTableFilter,
} from "@/shared/ui";

import { useAsignaciones } from "../hooks/useAsignaciones";
import { ASIGNACION_ESTADO_BADGE, type IAsignacionRow } from "../model/asignacion.types";
import { opcionesDocentePara } from "../model/compatibilidad";
import ReasignarDocenteDialog from "./ReasignarDocenteDialog";

interface IDialogState {
  catedras: IAsignacionRow[];
  docenteSugerido?: string;
}

export default function AsignacionesList() {
  const { data, isPending } = useAsignaciones();
  const catedras = useMemo(() => data?.catedras ?? [], [data]);
  const docentes = useMemo(() => data?.docentes ?? [], [data]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<IDialogState>({ catedras: [] });

  const seleccionadas = useMemo(
    () => catedras.filter((catedra) => selectedIds.includes(catedra.catedraId)),
    [catedras, selectedIds]
  );

  const docentesConCatedras = useMemo(() => {
    const ids = Array.from(new Set(catedras.map((catedra) => catedra.docenteId)));
    return docentes.filter((docente) => ids.includes(docente.id));
  }, [catedras, docentes]);

  const abrirReasignacion = (rows: IAsignacionRow[], docenteSugerido?: string) => {
    setDialogState({ catedras: rows, docenteSugerido });
    setDialogOpen(true);
  };

  const limpiarSeleccion = () => setSelectedIds([]);

  const columns: IAdminColumn<IAsignacionRow>[] = [
    {
      key: "codigo",
      label: "Cátedra",
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.codigo}</span>,
    },
    {
      key: "curso",
      label: "Curso",
      render: (row) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{row.curso}</span>
          <span className="truncate text-xs text-muted-foreground">{row.instrumento ?? "Sin instrumento"}</span>
        </div>
      ),
    },
    {
      key: "docente",
      label: "Docente asignado",
      render: (row) => {
        const opciones = opcionesDocentePara(row, docentes);

        if (opciones.length === 0) {
          return <span className="text-xs text-destructive">Sin docente compatible</span>;
        }

        return (
          <Select
            value={row.docenteId}
            onValueChange={(value) => abrirReasignacion([row], value)}
          >
            <SelectTrigger size="sm" className="w-56" aria-label={`Docente de ${row.codigo}`}>
              <SelectValue placeholder="Seleccione docente" />
            </SelectTrigger>
            <SelectContent>
              {opciones.map((docente) => (
                <SelectItem key={docente.id} value={docente.id}>
                  {docente.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      key: "estudiantes",
      label: "Estudiantes",
      render: (row) =>
        row.estudiantesActivos > 0 ? (
          <Badge variant="secondary">{row.estudiantesActivos}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "sesiones",
      label: "Sesiones",
      render: (row) => <span className="font-mono text-xs">{row.sesiones}</span>,
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={ASIGNACION_ESTADO_BADGE[row.estado].variant}>
          {ASIGNACION_ESTADO_BADGE[row.estado].label}
        </Badge>
      ),
    },
  ];

  const filters: IAdminDataTableFilter<IAsignacionRow>[] = [
    { value: "en_curso", label: "En curso", match: (row) => row.estado === "en_curso" },
    { value: "planificada", label: "Planificadas", match: (row) => row.estado === "planificada" },
    { value: "finalizada", label: "Finalizadas", match: (row) => row.estado === "finalizada" },
    ...docentesConCatedras.map((docente) => ({
      value: `docente-${docente.id}`,
      label: docente.nombre,
      match: (row: IAsignacionRow) => row.docenteId === docente.id,
    })),
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Academia · GOSMEL"
        title="Asignaciones"
        description="Qué docente dicta cada cátedra. Solo se ofrecen docentes que enseñan el instrumento del curso."
        icon="ph:arrows-left-right"
      />

      {selectedIds.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="text-sm font-medium">
            {selectedIds.length} {selectedIds.length === 1 ? "cátedra seleccionada" : "cátedras seleccionadas"}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={limpiarSeleccion}>
              Limpiar
            </Button>
            <Button size="sm" onClick={() => abrirReasignacion(seleccionadas)}>
              <Icon icon="ph:arrows-left-right" aria-hidden="true" />
              Reasignar a un docente
            </Button>
          </div>
        </div>
      ) : null}

      <AdminDataTable
        data={catedras}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.catedraId}
        searchKeys={[
          (row) => row.codigo,
          (row) => row.curso,
          (row) => row.instrumento ?? "",
          (row) => row.docente ?? "",
        ]}
        searchPlaceholder="Buscar por cátedra, curso, instrumento o docente…"
        filters={filters}
        emptyTitle="Sin cátedras"
        emptyDescription="Cuando se creen cátedras aparecerán aquí para asignarles docente."
        countLabel="cátedras"
        selection={{
          selectedIds,
          onToggle: (id) =>
            setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id])),
          onToggleAll: (ids) =>
            setSelectedIds((prev) => {
              const todosSeleccionados = ids.every((id) => prev.includes(id));
              if (todosSeleccionados) return prev.filter((id) => !ids.includes(id));
              return Array.from(new Set([...prev, ...ids]));
            }),
        }}
      />

      <ReasignarDocenteDialog
        key={dialogState.catedras.map((catedra) => catedra.catedraId).join("-") || "empty"}
        catedras={dialogState.catedras}
        docentes={docentes}
        docenteSugerido={dialogState.docenteSugerido}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={limpiarSeleccion}
      />
    </div>
  );
}
