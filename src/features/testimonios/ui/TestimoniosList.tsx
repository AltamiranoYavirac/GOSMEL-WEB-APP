"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";

import { AdminDataTable, AdminPageHeader, Switch, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";
import { buildCloudinaryImageUrl } from "@/shared/lib";

import { useTestimonios } from "../hooks/useTestimonios";
import { useUpdateTestimonioPublicado } from "../hooks/useUpdateTestimonioPublicado";
import type { ITestimonioRow } from "../model/testimonio.types";
import EliminarTestimonioDialog from "./EliminarTestimonioDialog";
import TestimonioFormDialog from "./TestimonioFormDialog";

export default function TestimoniosList() {
  const { data, isPending } = useTestimonios();
  const mutation = useUpdateTestimonioPublicado();
  const rows = data ?? [];
  const columns: IAdminColumn<ITestimonioRow>[] = [
    {
      key: "foto",
      label: "Foto",
      render: (row) => {
        const src = buildCloudinaryImageUrl(row.fotoPublicId, "ar_1:1,c_fill,g_auto,w_96,q_auto,f_auto");
        if (!src) return <span className="text-muted-foreground">—</span>;
        return (
          <span className="relative block size-10 overflow-hidden rounded-full border border-border">
            <Image src={src} alt={`Foto de ${row.autor}`} fill sizes="40px" className="object-cover" />
          </span>
        );
      },
    },
    { key: "autor", label: "Autor", render: (row) => <span className="font-medium">{row.autor}</span> },
    { key: "curso", label: "Curso", render: (row) => row.curso ?? <span className="text-muted-foreground">General</span> },
    { key: "docente", label: "Docente", render: (row) => row.docente ?? <span className="text-muted-foreground">—</span> },
    { key: "cita", label: "Cita", render: (row) => <span className="line-clamp-2 max-w-md whitespace-normal text-muted-foreground">&ldquo;{row.cita}&rdquo;</span> },
    {
      key: "puntuacion",
      label: "Puntuación",
      render: (row) => row.puntuacion != null ? <span className="inline-flex items-center gap-1"><Icon icon="ph:star-fill" className="size-3.5 text-primary" aria-hidden="true" />{row.puntuacion}</span> : "—",
    },
    {
      key: "publicado",
      label: "Publicado",
      render: (row) => <Switch size="sm" checked={row.publicado} disabled={mutation.isPending} onCheckedChange={(value) => mutation.mutate({ id: row.id, publicado: value })} aria-label={`Publicar o despublicar el testimonio de ${row.autor}`} />,
    },
    {
      key: "actions",
      label: "",
      render: (row) => <div className="flex justify-end gap-1"><TestimonioFormDialog item={row} /><EliminarTestimonioDialog item={row} /></div>,
    },
  ];
  const filters: IAdminDataTableFilter<ITestimonioRow>[] = [
    { value: "publicados", label: "Publicados", match: (row) => row.publicado },
    { value: "ocultos", label: "Ocultos", match: (row) => !row.publicado },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Sitio · GOSMEL" title="Testimonios" description="Testimonios generales, de cursos y de docentes (se muestran en el perfil público del docente)." icon="ph:chat-centered-text"><TestimonioFormDialog /></AdminPageHeader>
      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.autor, (row) => row.rol ?? "", (row) => row.cita, (row) => row.curso ?? "", (row) => row.docente ?? ""]}
        filters={filters}
        emptyTitle="Sin testimonios"
        emptyDescription="Agrega el primer testimonio desde el dashboard."
        countLabel="testimonios"
      />
    </div>
  );
}
