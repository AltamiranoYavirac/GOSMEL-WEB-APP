"use client";

import { AdminDataTable, AdminPageHeader, Badge, Switch, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";

import { useProgramas } from "../hooks/useProgramas";
import { useUpdateProgramaPublicado } from "../hooks/useUpdateProgramaPublicado";
import { NIVEL_BADGE, type IProgramaRow } from "../model/programa.types";
import CrearProgramaDialog from "./CrearProgramaDialog";
import EditarProgramaDialog from "./EditarProgramaDialog";
import EliminarProgramaDialog from "./EliminarProgramaDialog";
import ProgramaCursosSheet from "./ProgramaCursosSheet";

export default function ProgramasList() {
  const { data, isPending } = useProgramas();
  const mutation = useUpdateProgramaPublicado();
  const rows = data ?? [];

  const columns: IAdminColumn<IProgramaRow>[] = [
    {
      key: "nombre",
      label: "Programa",
      render: (row) => <span className="font-medium">{row.nombre}</span>,
    },
    {
      key: "nivel",
      label: "Nivel",
      render: (row) =>
        row.nivel ? (
          <Badge variant={NIVEL_BADGE[row.nivel].variant}>{NIVEL_BADGE[row.nivel].label}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "instrumento",
      label: "Instrumento",
      render: (row) => row.instrumento ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "cursos",
      label: "Cursos",
      render: (row) => (
        <Badge variant={row.numCursos > 0 ? "outline" : "ghost"}>
          {row.numCursos > 0 ? `${row.numCursos} ${row.numCursos === 1 ? "curso" : "cursos"}` : "Sin cursos"}
        </Badge>
      ),
    },
    {
      key: "publicado",
      label: "Publicado",
      render: (row) => (
        <Switch
          size="sm"
          checked={row.publicado}
          disabled={mutation.isPending}
          onCheckedChange={(value) => mutation.mutate({ id: row.id, publicado: value })}
          aria-label={`Publicar o despublicar ${row.nombre}`}
        />
      ),
    },
  ];

  const filters: IAdminDataTableFilter<IProgramaRow>[] = [
    { value: "publicados", label: "Publicados", match: (row) => row.publicado },
    { value: "ocultos", label: "Ocultos", match: (row) => !row.publicado },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          eyebrow="Académico · GOSMEL"
          title="Programas"
          description="Programas formativos que agrupan varios cursos por instrumento y nivel."
          icon="ph:graduation-cap"
        />
        <CrearProgramaDialog />
      </div>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.nombre, (row) => row.instrumento ?? ""]}
        filters={filters}
        emptyTitle="Sin programas"
        emptyDescription="Cuando se creen programas aparecerán aquí."
        countLabel="programas"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <ProgramaCursosSheet programaId={row.id} programaNombre={row.nombre} />
            <EditarProgramaDialog programa={row} />
            <EliminarProgramaDialog programa={row} />
          </div>
        )}
      />
    </div>
  );
}