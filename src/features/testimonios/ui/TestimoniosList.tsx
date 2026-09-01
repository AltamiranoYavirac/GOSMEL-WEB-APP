"use client";

import { Icon } from "@iconify/react";

import { AdminDataTable, AdminPageHeader, Switch, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";

import { useTestimonios } from "../hooks/useTestimonios";
import { useUpdateTestimonioPublicado } from "../hooks/useUpdateTestimonioPublicado";
import type { ITestimonioRow } from "../model/testimonio.types";

export default function TestimoniosList() {
  const { data, isPending } = useTestimonios();
  const mutation = useUpdateTestimonioPublicado();
  const rows = data ?? [];

  const columns: IAdminColumn<ITestimonioRow>[] = [
    {
      key: "autor",
      label: "Autor",
      render: (row) => <span className="font-medium">{row.autor}</span>,
    },
    {
      key: "rol",
      label: "Rol",
      render: (row) => row.rol ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "cita",
      label: "Cita",
      render: (row) => (
        <span className="line-clamp-2 max-w-md whitespace-normal text-muted-foreground">&ldquo;{row.cita}&rdquo;</span>
      ),
    },
    {
      key: "puntuacion",
      label: "Puntuación",
      render: (row) =>
        row.puntuacion != null ? (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Icon icon="ph:star-fill" className="size-3.5 text-primary" aria-hidden="true" />
            {row.puntuacion}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
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
          aria-label={`Publicar o despublicar el testimonio de ${row.autor}`}
        />
      ),
    },
  ];

  const filters: IAdminDataTableFilter<ITestimonioRow>[] = [
    { value: "publicados", label: "Publicados", match: (row) => row.publicado },
    { value: "ocultos", label: "Ocultos", match: (row) => !row.publicado },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Sitio · GOSMEL"
        title="Testimonios"
        description="Testimonios y reseñas de cursos que se muestran en el sitio público."
        icon="ph:chat-centered-text"
      />

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.autor, (row) => row.rol ?? "", (row) => row.cita]}
        filters={filters}
        emptyTitle="Sin testimonios"
        emptyDescription="Cuando se registren testimonios aparecerán aquí."
        countLabel="testimonios"
      />
    </div>
  );
}