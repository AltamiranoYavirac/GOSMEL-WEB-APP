"use client";

import { AdminDataTable, AdminPageHeader, Avatar, AvatarFallback, Badge, type IAdminColumn } from "@/shared/ui";
import { initialsOf } from "@/shared/lib/formatters";

import { useRepresentantes } from "../hooks/useRepresentantes";
import type { IRepresentanteRow } from "../model/representante.types";

export default function RepresentantesList() {
  const { data, isPending } = useRepresentantes();
  const rows = data ?? [];

  const columns: IAdminColumn<IRepresentanteRow>[] = [
    {
      key: "representante",
      label: "Representante",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{initialsOf(row.nombre)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{row.nombre}</span>
            {row.email ? <span className="truncate text-xs text-muted-foreground">{row.email}</span> : null}
          </div>
        </div>
      ),
    },
    {
      key: "cedula",
      label: "Cédula",
      render: (row) => row.cedula ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "celular",
      label: "Teléfono",
      render: (row) => row.celular ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "ocupacion",
      label: "Ocupación",
      render: (row) => row.ocupacion ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "hijos",
      label: "Hijos vinculados",
      render: (row) => (
        <Badge variant={row.hijos > 0 ? "default" : "outline"}>
          {row.hijos > 0 ? `${row.hijos} ${row.hijos === 1 ? "hijo" : "hijos"}` : "Sin vínculos"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Comunidad · GOSMEL"
        title="Representantes"
        description="Padres o tutores vinculados a estudiantes y su relación de parentesco."
        icon="ph:identification-badge"
      />

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.nombre, (row) => row.cedula ?? "", (row) => row.celular ?? "", (row) => row.email ?? ""]}
        emptyTitle="Sin representantes"
        emptyDescription="Cuando se vinculen representantes aparecerán aquí."
        countLabel="representantes"
      />
    </div>
  );
}