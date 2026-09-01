"use client";

import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type IAdminColumn,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useHorariosRecurrentes } from "../hooks/useHorariosRecurrentes";
import { useSesiones } from "../hooks/useSesiones";
import { useEliminarHorarioRecurrente } from "../hooks/useEliminarHorarioRecurrente";
import { useUpdateSesionEstado, useEliminarSesion } from "../hooks/useUpdateSesionEstado";
import {
  DIAS_SEMANA,
  SESION_ESTADO_BADGE,
  type IHorarioRecurrenteRow,
  type ISesionRow,
  type TEstadoSesion,
} from "../model/horario.types";
import CrearHorarioDialog from "./CrearHorarioDialog";
import CrearSesionDialog from "./CrearSesionDialog";
import TomarAsistenciaDialog from "./TomarAsistenciaDialog";

export default function HorariosList() {
  const recurrentes = useHorariosRecurrentes();
  const sesiones = useSesiones();
  const eliminarHorario = useEliminarHorarioRecurrente();
  const updateSesion = useUpdateSesionEstado();
  const eliminarSesion = useEliminarSesion();

  const recurrentesColumns: IAdminColumn<IHorarioRecurrenteRow>[] = [
    {
      key: "catedra",
      label: "Cátedra",
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.catedra}</span>,
    },
    {
      key: "curso",
      label: "Curso",
      render: (row) => <span className="font-medium">{row.curso}</span>,
    },
    {
      key: "dia",
      label: "Día",
      render: (row) => DIAS_SEMANA[row.diaSemana] ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "horaInicio",
      label: "Inicio",
      render: (row) => <span className="font-mono text-sm text-muted-foreground">{row.horaInicio}</span>,
    },
    {
      key: "horaFin",
      label: "Fin",
      render: (row) => <span className="font-mono text-sm text-muted-foreground">{row.horaFin}</span>,
    },
  ];

  const sesionesColumns: IAdminColumn<ISesionRow>[] = [
    {
      key: "catedra",
      label: "Cátedra",
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.catedra}</span>,
    },
    {
      key: "curso",
      label: "Curso",
      render: (row) => <span className="font-medium">{row.curso}</span>,
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => <span className="text-muted-foreground">{formatDate(row.fecha)}</span>,
    },
    {
      key: "hora",
      label: "Hora",
      render: (row) => (
        <span className="font-mono text-sm text-muted-foreground">
          {row.horaInicio} – {row.horaFin}
        </span>
      ),
    },
    {
      key: "tema",
      label: "Tema",
      render: (row) => row.tema ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "asistencia",
      label: "Asistencia",
      render: (row) =>
        row.totalAsistencia > 0 ? (
          <span className="text-muted-foreground">
            {row.presentes} / {row.totalAsistencia}
          </span>
        ) : (
          <span className="text-muted-foreground">Sin registro</span>
        ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={SESION_ESTADO_BADGE[row.estado].variant}>{SESION_ESTADO_BADGE[row.estado].label}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          eyebrow="Académico · GOSMEL"
          title="Horarios y sesiones"
          description="Horarios recurrentes de cada cátedra y el registro de sus sesiones y asistencia."
          icon="ph:calendar-check"
        />
        <div className="flex items-center gap-2">
          <CrearHorarioDialog />
          <CrearSesionDialog />
        </div>
      </div>

      <Tabs defaultValue="recurrentes">
        <TabsList>
          <TabsTrigger value="recurrentes">Horarios recurrentes</TabsTrigger>
          <TabsTrigger value="sesiones">Sesiones y asistencia</TabsTrigger>
        </TabsList>

        <TabsContent value="recurrentes" className="pt-2">
          <AdminDataTable
            data={recurrentes.data ?? []}
            columns={recurrentesColumns}
            loading={recurrentes.isPending}
            keyId={(row) => row.id}
            searchKeys={[(row) => row.catedra, (row) => row.curso]}
            emptyTitle="Sin horarios recurrentes"
            emptyDescription="Cuando se configuren horarios aparecerán aquí."
            countLabel="horarios"
            rowActions={(row) => (
              <div className="flex items-center justify-end">
                <Button
                  size="icon-xs"
                  variant="ghost"
                  disabled={eliminarHorario.isPending}
                  onClick={() => eliminarHorario.mutate(row.id)}
                  aria-label="Eliminar horario recurrente"
                >
                  <Icon icon="ph:trash" className="size-4 text-muted-foreground hover:text-destructive" aria-hidden="true" />
                </Button>
              </div>
            )}
          />
        </TabsContent>

        <TabsContent value="sesiones" className="pt-2">
          <AdminDataTable
            data={sesiones.data ?? []}
            columns={sesionesColumns}
            loading={sesiones.isPending}
            keyId={(row) => row.id}
            searchKeys={[(row) => row.catedra, (row) => row.curso, (row) => row.tema ?? ""]}
            emptyTitle="Sin sesiones"
            emptyDescription="Cuando se registren sesiones aparecerán aquí."
            countLabel="sesiones"
            rowActions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <TomarAsistenciaDialog sesion={row} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs" aria-label="Cambiar estado de sesión">
                      <Icon icon="ph:dots-three-vertical" className="size-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {(["programada", "realizada", "reprogramada", "cancelada"] as TEstadoSesion[]).map((st) => (
                      <DropdownMenuItem
                        key={st}
                        disabled={row.estado === st || updateSesion.isPending}
                        onSelect={() => updateSesion.mutate({ sesionId: row.id, estado: st })}
                      >
                        <Badge variant={SESION_ESTADO_BADGE[st].variant} className="mr-2">
                          {SESION_ESTADO_BADGE[st].label}
                        </Badge>
                        Marcar como {SESION_ESTADO_BADGE[st].label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => eliminarSesion.mutate(row.id)}
                    >
                      <Icon icon="ph:trash" className="mr-2 size-4" aria-hidden="true" />
                      Eliminar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}