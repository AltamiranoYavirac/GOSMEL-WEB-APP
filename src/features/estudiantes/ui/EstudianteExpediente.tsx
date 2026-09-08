"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import { Badge, DataLabel, Skeleton, Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import { formatDate, initialsOf } from "@/shared/lib/formatters";

import { useEstudianteDetalle } from "../hooks/useEstudianteDetalle";
import ExpedienteAcademicoTab from "./ExpedienteAcademicoTab";
import ExpedienteBitacoraTab from "./ExpedienteBitacoraTab";
import ExpedienteFinancieroTab from "./ExpedienteFinancieroTab";
import ExpedientePerfilTab from "./ExpedientePerfilTab";
import type { IEstudianteExpedienteProps } from "./EstudianteExpediente.types";

export default function EstudianteExpediente({ estudianteId }: IEstudianteExpedienteProps) {
  const { data, isPending } = useEstudianteDetalle(estudianteId);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/admin/estudiantes"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground"
      >
        <Icon icon="ph:caret-left" width={14} height={14} aria-hidden="true" />
        Estudiantes
      </Link>

      {isPending ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : !data ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card py-16 text-center">
          <Icon icon="ph:warning-circle" className="size-8 text-destructive" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">No se pudo cargar el expediente de este estudiante.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-start">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-foreground/8 text-xl font-bold text-foreground">
              {initialsOf(data.nombre)}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-heading text-[22px] font-bold text-foreground">{data.nombre}</h1>
                <Badge variant={data.activo ? "success" : "ghost"}>{data.activo ? "Activo" : "Inactivo"}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
                <div>
                  <DataLabel>Cédula</DataLabel>
                  <div className="mt-0.5 text-[13px] font-semibold text-foreground">{data.cedula ?? "—"}</div>
                </div>
                <div>
                  <DataLabel>Nacimiento</DataLabel>
                  <div className="mt-0.5 text-[13px] font-semibold text-foreground">
                    {data.fechaNacimiento ? formatDate(data.fechaNacimiento) : "—"}
                  </div>
                </div>
                <div>
                  <DataLabel>Contacto</DataLabel>
                  <div className="mt-0.5 text-[13px] font-semibold text-foreground">
                    {data.email ?? data.celular ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="perfil">
            <TabsList>
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="academico">Académico</TabsTrigger>
              <TabsTrigger value="financiero">Financiero</TabsTrigger>
              <TabsTrigger value="bitacora">Bitácora</TabsTrigger>
            </TabsList>
            <TabsContent value="perfil">
              <ExpedientePerfilTab estudianteId={estudianteId} detalle={data} />
            </TabsContent>
            <TabsContent value="academico">
              <ExpedienteAcademicoTab estudianteId={estudianteId} detalle={data} />
            </TabsContent>
            <TabsContent value="financiero">
              <ExpedienteFinancieroTab estudianteId={estudianteId} detalle={data} />
            </TabsContent>
            <TabsContent value="bitacora">
              <ExpedienteBitacoraTab />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
