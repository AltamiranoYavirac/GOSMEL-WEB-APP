"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  AdminDataTable,
  AdminPageHeader,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  type IAdminColumn,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useTeacherSesiones } from "../hooks/useTeacherSesiones";
import { useUpdateTeacherSesionEstado } from "../hooks/useUpdateTeacherSesionEstado";
import {
  SESION_ESTADO_BADGE,
  SESION_ESTADO_DOT,
  type ITeacherSesion,
  type TEstadoSesion,
} from "../model/teacher-dashboard.types";
import CrearSesionTeacherDialog from "./CrearSesionTeacherDialog";
import TomarAsistenciaTeacherDialog from "./TomarAsistenciaTeacherDialog";
import type { ITeacherSesionesViewProps } from "./TeacherSesionesView.types";

export default function TeacherSesionesView({ className }: ITeacherSesionesViewProps) {
  const { data = [], isPending } = useTeacherSesiones();
  const updateEstadoMutation = useUpdateTeacherSesionEstado();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedSesionId, setSelectedSesionId] = useState<string | null>(null);

  const handleEstadoChange = async (sesionId: string, estado: TEstadoSesion) => {
    try {
      await updateEstadoMutation.mutateAsync({ sesionId, estado });
      toast.success("Estado de sesión actualizado");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar estado";
      toast.error(msg);
    }
  };

  const columns: IAdminColumn<ITeacherSesion>[] = [
    {
      key: "catedra",
      label: "Cátedra",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary">{row.catedra}</span>
      ),
    },
    {
      key: "curso",
      label: "Curso",
      render: (row) => (
        <span className="truncate text-xs font-medium text-foreground">{row.curso}</span>
      ),
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => (
        <span className="text-xs text-muted-foreground">{formatDate(row.fecha)}</span>
      ),
    },
    {
      key: "horario",
      label: "Horario",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.inicio}–{row.fin}
        </span>
      ),
    },
    {
      key: "tema",
      label: "Tema",
      render: (row) => (
        <span className="text-xs text-muted-foreground">{row.tema ?? "—"}</span>
      ),
    },
    {
      key: "asistencia",
      label: "Asistencia",
      render: (row) =>
        row.totalAsistencia > 0 ? (
          <span className="font-medium text-xs text-foreground">
            {row.presentes} / {row.totalAsistencia} presentes
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Sin registrar</span>
        ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Select
          value={row.estado}
          onValueChange={(val) => handleEstadoChange(row.id, val as TEstadoSesion)}
        >
          <SelectTrigger className="h-7 w-36 text-[11px]" aria-label="Estado de la sesión">
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className={`size-2 shrink-0 rounded-full ${SESION_ESTADO_DOT[row.estado]}`}
                aria-hidden="true"
              />
              <span className="truncate">{SESION_ESTADO_BADGE[row.estado].label}</span>
            </span>
          </SelectTrigger>
          <SelectContent>
            {(["programada", "realizada", "reprogramada", "cancelada"] as TEstadoSesion[]).map((estado) => (
              <SelectItem key={estado} value={estado}>
                <span className="flex items-center gap-1.5">
                  <span
                    className={`size-2 shrink-0 rounded-full ${SESION_ESTADO_DOT[estado]}`}
                    aria-hidden="true"
                  />
                  {SESION_ESTADO_BADGE[estado].label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "acciones",
      label: "Asistencia",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedSesionId(row.id)}
          className="flex items-center gap-1.5"
        >
          <Icon icon="ph:check-square" className="size-4 text-primary" />
          Tomar asistencia
        </Button>
      ),
    },
  ];

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      <AdminPageHeader
        eyebrow="Portal · Docente"
        title="Sesiones y Asistencia"
        description="Gestiona las sesiones de tus cátedras, crea sesiones extraordinarias, actualiza estados y registra la asistencia de tus alumnos."
        icon="ph:calendar-check"
      >
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Icon icon="ph:plus-circle" className="size-4" />
          Nueva Sesión
        </Button>
      </AdminPageHeader>

      <AdminDataTable
        data={data}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.catedra, (row) => row.curso, (row) => row.tema ?? ""]}
        emptyTitle="Sin sesiones registradas"
        emptyDescription="Puedes programar una sesión con el botón 'Nueva Sesión'."
        countLabel="sesiones"
      />

      <CrearSesionTeacherDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {selectedSesionId ? (
        <TomarAsistenciaTeacherDialog
          sesionId={selectedSesionId}
          open={Boolean(selectedSesionId)}
          onOpenChange={(open) => {
            if (!open) setSelectedSesionId(null);
          }}
        />
      ) : null}
    </div>
  );
}
