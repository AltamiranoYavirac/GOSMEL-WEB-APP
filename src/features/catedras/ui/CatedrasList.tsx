"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  type IAdminColumn,
  type IAdminDataTableFilter,
} from "@/shared/ui";

import { useCatedras } from "../hooks/useCatedras";
import { CATEDRA_ESTADO_BADGE, MODALIDAD_BADGE, type ICatedraRow } from "../model/catedra.types";
import CatedraEstudiantesSheet from "./CatedraEstudiantesSheet";
import CrearCatedraDialog from "./CrearCatedraDialog";
import EditarCatedraDialog from "./EditarCatedraDialog";
import EliminarCatedraDialog from "./EliminarCatedraDialog";
import GenerarSesionesCatedraDialog from "./GenerarSesionesCatedraDialog";

export default function CatedrasList() {
  const { data, isPending } = useCatedras();
  const rows = data ?? [];

  const [editTarget, setEditTarget] = useState<ICatedraRow | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [genTarget, setGenTarget] = useState<ICatedraRow | null>(null);
  const [genOpen, setGenOpen] = useState(false);

  const [estudiantesTarget, setEstudiantesTarget] = useState<ICatedraRow | null>(null);
  const [estudiantesOpen, setEstudiantesOpen] = useState(false);
  const [estudiantesDefaultTab, setEstudiantesDefaultTab] = useState<"matriculados" | "pendientes">("matriculados");

  const handleOpenEdit = (catedra: ICatedraRow) => {
    setEditTarget(catedra);
    setEditOpen(true);
  };

  const handleOpenGen = (catedra: ICatedraRow) => {
    setGenTarget(catedra);
    setGenOpen(true);
  };

  const handleOpenEstudiantes = (catedra: ICatedraRow, tab: "matriculados" | "pendientes" = "matriculados") => {
    setEstudiantesTarget(catedra);
    setEstudiantesDefaultTab(tab);
    setEstudiantesOpen(true);
  };

  const columns: IAdminColumn<ICatedraRow>[] = [
    {
      key: "codigo",
      label: "Código",
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.codigo}</span>,
    },
    {
      key: "curso",
      label: "Curso",
      render: (row) => <span className="font-medium">{row.curso}</span>,
    },
    {
      key: "docente",
      label: "Docente",
      render: (row) => row.docente ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "modalidad",
      label: "Modalidad",
      render: (row) => (
        <Badge variant={MODALIDAD_BADGE[row.modalidad].variant}>{MODALIDAD_BADGE[row.modalidad].label}</Badge>
      ),
    },
    {
      key: "aula",
      label: "Aula",
      render: (row) => row.aula ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "cupo",
      label: "Estudiantes / Cupo",
      render: (row) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => handleOpenEstudiantes(row, "matriculados")}
            className="h-6 px-2 text-xs font-mono font-medium hover:bg-primary/10 hover:text-primary gap-1"
            title="Ver estudiantes matriculados"
          >
            <Icon icon="ph:users" className="size-3.5" aria-hidden="true" />
            {row.activos} / {row.cupoMaximo}
          </Button>
          {row.pendientes > 0 ? (
            <Badge
              variant="warning"
              className="cursor-pointer text-[10px] py-0 px-1.5 font-normal hover:opacity-85"
              onClick={() => handleOpenEstudiantes(row, "pendientes")}
              title="Ver solicitudes pendientes"
            >
              +{row.pendientes} solic.
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={CATEDRA_ESTADO_BADGE[row.estado].variant}>{CATEDRA_ESTADO_BADGE[row.estado].label}</Badge>
      ),
    },
  ];

  const filters: IAdminDataTableFilter<ICatedraRow>[] = [
    { value: "en_curso", label: "En curso", match: (row) => row.estado === "en_curso" },
    { value: "planificada", label: "Planificadas", match: (row) => row.estado === "planificada" },
    { value: "finalizada", label: "Finalizadas", match: (row) => row.estado === "finalizada" },
    { value: "pendientes", label: "Con matrículas pendientes", match: (row) => row.pendientes > 0 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Académico · GOSMEL"
        title="Cátedras"
        description="Secciones de curso: docente asignado, cupo, modalidad e inscripciones."
        icon="ph:chalkboard"
      >
        <CrearCatedraDialog />
      </AdminPageHeader>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.codigo, (row) => row.curso, (row) => row.docente ?? "", (row) => row.aula ?? ""]}
        filters={filters}
        emptyTitle="Sin cátedras"
        emptyDescription="Cuando se creen cátedras aparecerán aquí."
        countLabel="cátedras"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-1">
            {row.pendientes > 0 ? (
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleOpenEstudiantes(row, "pendientes")}
                className="h-8 text-xs font-medium border-warning/40 text-warning hover:bg-warning/10 gap-1 px-2.5"
                title="Ver solicitudes pendientes"
              >
                <Icon icon="ph:clock" className="size-3.5" aria-hidden="true" />
                {row.pendientes} solicitud{row.pendientes > 1 ? "es" : ""}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleOpenEstudiantes(row, "matriculados")}
              title="Ver estudiantes matriculados"
              className="size-8 p-0"
            >
              <Icon icon="ph:users" width={16} height={16} aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleOpenGen(row)}
              title="Generar sesiones del ciclo"
              className="size-8 p-0"
            >
              <Icon icon="ph:calendar-plus" width={16} height={16} aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleOpenEdit(row)}
              title="Editar condiciones de cátedra"
              className="size-8 p-0"
            >
              <Icon icon="ph:pencil-simple" width={16} height={16} aria-hidden="true" />
            </Button>
            <EliminarCatedraDialog catedra={row} />
          </div>
        )}
      />

      <EditarCatedraDialog
        key={editTarget?.id ?? "none"}
        catedra={editTarget}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <GenerarSesionesCatedraDialog
        catedra={genTarget}
        open={genOpen}
        onOpenChange={setGenOpen}
      />

      <CatedraEstudiantesSheet
        key={estudiantesTarget?.id ?? "none"}
        catedra={estudiantesTarget}
        open={estudiantesOpen}
        onOpenChange={setEstudiantesOpen}
        defaultTab={estudiantesDefaultTab}
      />
    </div>
  );
}