"use client";

import { Icon } from "@iconify/react";

import { AdminDataTable, AdminPageHeader, Badge, Switch, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";

import { useCursos } from "../hooks/useCursos";
import { useUpdateCurso } from "../hooks/useUpdateCurso";
import { MODALIDAD_BADGE, NIVEL_BADGE, type ICursoRow } from "../model/curso.types";
import CrearCursoDialog from "./CrearCursoDialog";
import CursoGuiaSheet from "./CursoGuiaSheet";

export default function CursosList() {
  const { data, isPending } = useCursos();
  const mutation = useUpdateCurso();
  const rows = data ?? [];

  const columns: IAdminColumn<ICursoRow>[] = [
    {
      key: "nombre",
      label: "Curso",
      render: (row) => <span className="font-medium">{row.nombre}</span>,
    },
    {
      key: "nivel",
      label: "Nivel",
      render: (row) => <Badge variant={NIVEL_BADGE[row.nivel].variant}>{NIVEL_BADGE[row.nivel].label}</Badge>,
    },
    {
      key: "modalidad",
      label: "Modalidad",
      render: (row) => (
        <Badge variant={MODALIDAD_BADGE[row.modalidad].variant}>{MODALIDAD_BADGE[row.modalidad].label}</Badge>
      ),
    },
    {
      key: "instrumento",
      label: "Instrumento",
      render: (row) => row.instrumento ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "rating",
      label: "Valoración",
      render: (row) =>
        row.totalResenas > 0 ? (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Icon icon="ph:star-fill" className="size-3.5 text-primary" aria-hidden="true" />
            {row.rating.toFixed(1)} <span className="text-xs">({row.totalResenas})</span>
          </span>
        ) : (
          <span className="text-muted-foreground">Sin reseñas</span>
        ),
    },
    {
      key: "modulos",
      label: "Módulos",
      render: (row) => row.modulos,
    },
    {
      key: "destacado",
      label: "Destacado",
      render: (row) => (
        <Switch
          size="sm"
          checked={row.destacado}
          disabled={mutation.isPending}
          onCheckedChange={(value) => mutation.mutate({ id: row.id, patch: { destacado: value } })}
          aria-label={`Destacar o quitar de destacados ${row.nombre}`}
        />
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
          onCheckedChange={(value) => mutation.mutate({ id: row.id, patch: { publicado: value } })}
          aria-label={`Publicar o despublicar ${row.nombre}`}
        />
      ),
    },
  ];

  const filters: IAdminDataTableFilter<ICursoRow>[] = [
    { value: "presencial", label: "Presencial", match: (row) => row.modalidad === "presencial" },
    { value: "virtual", label: "Virtual", match: (row) => row.modalidad === "virtual" },
    { value: "hibrido", label: "Híbrido", match: (row) => row.modalidad === "hibrido" },
    { value: "publicados", label: "Publicados", match: (row) => row.publicado },
    { value: "destacados", label: "Destacados", match: (row) => row.destacado },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Académico · GOSMEL"
        title="Cursos"
        description="Catálogo de lo que la academia ofrece. La asignación a docentes y el precio se gestionan en Cátedras y Acuerdos de pago."
        icon="ph:books"
      >
        <CrearCursoDialog />
      </AdminPageHeader>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.nombre, (row) => row.instrumento ?? ""]}
        filters={filters}
        emptyTitle="Sin cursos"
        emptyDescription="Cuando se creen cursos aparecerán aquí."
        countLabel="cursos"
        rowActions={(row) => <CursoGuiaSheet cursoId={row.id} cursoNombre={row.nombre} />}
      />
    </div>
  );
}