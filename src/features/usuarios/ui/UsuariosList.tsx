"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { AdminDataTable, AdminPageHeader, Avatar, AvatarFallback, Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Switch, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";
import { initialsOf } from "@/shared/lib/formatters";

import { useUsuarios } from "../hooks/useUsuarios";
import { useAsignarRolDocente } from "../hooks/useAsignarRolDocente";
import { useQuitarRol } from "../hooks/useQuitarRol";
import { useUpdateUsuarioActivo } from "../hooks/useUpdateUsuarioActivo";
import { ROL_BADGE, type IUsuarioRow } from "../model/usuario.types";
import AsignarEstudianteDialog from "./AsignarEstudianteDialog";
import EditarContactoDialog from "./EditarContactoDialog";

export default function UsuariosList() {
  const { data, isPending } = useUsuarios();
  const mutation = useUpdateUsuarioActivo();
  const asignarDocente = useAsignarRolDocente();
  const quitarRol = useQuitarRol();
  const [estudianteAsignar, setEstudianteAsignar] = useState<IUsuarioRow | null>(null);
  const rows = data ?? [];

  const columns: IAdminColumn<IUsuarioRow>[] = [
    {
      key: "perfil",
      label: "Perfil",
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
      key: "roles",
      label: "Roles",
      render: (row) =>
        row.roles.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.roles.map((rol) => (
              <Badge key={rol} variant={ROL_BADGE[rol].variant} className={ROL_BADGE[rol].className}>
                {ROL_BADGE[rol].label}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "activo",
      label: "Activo",
      render: (row) =>
        row.roles.includes("admin") ? (
          <span className="text-xs text-muted-foreground">Protegido</span>
        ) : (
          <Switch
            size="sm"
            checked={row.activo}
            disabled={mutation.isPending}
            onCheckedChange={(value) => mutation.mutate({ id: row.id, activo: value })}
            aria-label={`Activar o desactivar a ${row.nombre}`}
          />
        ),
    },
  ];

  const filters: IAdminDataTableFilter<IUsuarioRow>[] = [
    { value: "admin", label: "Administradores", match: (row) => row.roles.includes("admin") },
    { value: "docente", label: "Docentes", match: (row) => row.roles.includes("docente") },
    { value: "estudiante", label: "Estudiantes", match: (row) => row.roles.includes("estudiante") },
    { value: "representante", label: "Representantes", match: (row) => row.roles.includes("representante") },
    { value: "activos", label: "Activos", match: (row) => row.activo },
    { value: "inactivos", label: "Inactivos", match: (row) => !row.activo },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Comunidad · GOSMEL"
        title="Usuarios y roles"
        description="Administra las cuentas de la plataforma y sus roles asignados."
        icon="ph:users-three"
      />

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.nombre, (row) => row.email ?? "", (row) => row.cedula ?? "", (row) => row.celular ?? ""]}
        filters={filters}
        emptyTitle="Sin usuarios"
        emptyDescription="Cuando se registren cuentas aparecerán aquí."
        countLabel="usuarios"
        rowActions={(row) => {
          const puedeAsignarDocente = !row.roles.includes("docente");
          const puedeAsignarEstudiante = !row.roles.includes("estudiante");
          const puedeQuitarDocente = row.roles.includes("docente");
          const puedeQuitarEstudiante = row.roles.includes("estudiante");
          const puedeQuitarRepresentante = row.roles.includes("representante");
          const sinOpciones =
            !puedeAsignarDocente &&
            !puedeAsignarEstudiante &&
            !puedeQuitarDocente &&
            !puedeQuitarEstudiante &&
            !puedeQuitarRepresentante;

          return (
            <div className="flex items-center justify-end gap-2">
              <EditarContactoDialog usuario={row} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" aria-label={`Gestionar roles de ${row.nombre}`}>
                    <Icon icon="ph:plus" aria-hidden="true" />
                    Rol
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {puedeAsignarDocente ? (
                    <DropdownMenuItem
                      onSelect={() => asignarDocente.mutate({ perfilId: row.id, nombre: row.nombre })}
                    >
                      <Icon icon="ph:chalkboard-teacher" aria-hidden="true" />
                      Asignar docente
                    </DropdownMenuItem>
                  ) : null}
                  {puedeAsignarEstudiante ? (
                    <DropdownMenuItem onSelect={() => setEstudianteAsignar(row)}>
                      <Icon icon="ph:student" aria-hidden="true" />
                      Asignar estudiante
                    </DropdownMenuItem>
                  ) : null}

                  {puedeQuitarDocente || puedeQuitarEstudiante || puedeQuitarRepresentante ? (
                    <DropdownMenuSeparator />
                  ) : null}
                  {puedeQuitarDocente ? (
                    <DropdownMenuItem onSelect={() => quitarRol.mutate({ perfilId: row.id, rol: "docente" })}>
                      <Icon icon="ph:minus-circle" aria-hidden="true" />
                      Quitar docente
                    </DropdownMenuItem>
                  ) : null}
                  {puedeQuitarEstudiante ? (
                    <DropdownMenuItem onSelect={() => quitarRol.mutate({ perfilId: row.id, rol: "estudiante" })}>
                      <Icon icon="ph:minus-circle" aria-hidden="true" />
                      Quitar estudiante
                    </DropdownMenuItem>
                  ) : null}
                  {puedeQuitarRepresentante ? (
                    <DropdownMenuItem onSelect={() => quitarRol.mutate({ perfilId: row.id, rol: "representante" })}>
                      <Icon icon="ph:minus-circle" aria-hidden="true" />
                      Quitar representante
                    </DropdownMenuItem>
                  ) : null}

                  {sinOpciones ? (
                    <DropdownMenuItem disabled>Sin acciones disponibles</DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }}
      />

      <AsignarEstudianteDialog
        usuario={estudianteAsignar ? { id: estudianteAsignar.id, nombre: estudianteAsignar.nombre, cedula: estudianteAsignar.cedula } : null}
        onClose={() => setEstudianteAsignar(null)}
      />
    </div>
  );
}