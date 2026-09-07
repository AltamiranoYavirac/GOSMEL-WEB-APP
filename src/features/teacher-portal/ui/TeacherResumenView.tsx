"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import {
  AdminPageHeader,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useTeacherDashboard } from "../hooks/useTeacherDashboard";
import {
  EVALUACION_TIPO_BADGE,
  SESION_ESTADO_BADGE,
} from "../model/teacher-dashboard.types";
import TeacherResumenStatCard from "./TeacherResumenStatCard";
import type { ITeacherResumenViewProps } from "./TeacherResumenView.types";

export default function TeacherResumenView({ className }: ITeacherResumenViewProps) {
  const { data, isPending } = useTeacherDashboard();

  if (isPending) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Portal · Docente"
          title="Mi panel"
          description="Cargando tu información académica..."
          icon="ph:chalkboard-teacher"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <Icon icon="ph:warning-circle" className="size-7" aria-hidden="true" />
        </span>
        <h3 className="font-heading text-lg font-semibold text-foreground">
          No se pudieron cargar los datos
        </h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Ocurrió un error al consultar tus cátedras y sesiones asignadas.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className ?? ""}`}>
      <AdminPageHeader
        eyebrow="Portal · Docente"
        title={`Hola, ${data.nombre}`}
        description="Aquí tienes un panorama completo de tus cátedras, sesiones del día y actividades pendientes."
        icon="ph:chalkboard-teacher"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TeacherResumenStatCard
          icon="ph:chalkboard"
          label="Cátedras activas"
          value={data.counts.catedrasActivas}
          description="Cursos asignados"
        />
        <TeacherResumenStatCard
          icon="ph:calendar-check"
          label="Sesiones de hoy"
          value={data.counts.sesionesHoy}
          description="Agenda del día"
        />
        <TeacherResumenStatCard
          icon="ph:student"
          label="Estudiantes"
          value={data.counts.inscritos}
          description="Matrículas activas"
        />
        <TeacherResumenStatCard
          icon="ph:exam"
          label="Por calificar"
          value={data.counts.evaluacionesPendientes}
          description="Evaluaciones pendientes"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Link href="/dashboard/teacher/catedras" className="group">
          <Card className="h-full border-border/60 transition-all group-hover:border-primary/50 group-hover:shadow-sm">
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary-tint group-hover:text-primary">
                <Icon icon="ph:chalkboard" className="size-5" />
              </span>
              <span className="text-xs font-semibold text-foreground">Mis Cátedras</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/teacher/estudiantes" className="group">
          <Card className="h-full border-border/60 transition-all group-hover:border-primary/50 group-hover:shadow-sm">
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary-tint group-hover:text-primary">
                <Icon icon="ph:student" className="size-5" />
              </span>
              <span className="text-xs font-semibold text-foreground">Estudiantes</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/teacher/sesiones" className="group">
          <Card className="h-full border-border/60 transition-all group-hover:border-primary/50 group-hover:shadow-sm">
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary-tint group-hover:text-primary">
                <Icon icon="ph:calendar-check" className="size-5" />
              </span>
              <span className="text-xs font-semibold text-foreground">Sesiones</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/teacher/evaluaciones" className="group">
          <Card className="h-full border-border/60 transition-all group-hover:border-primary/50 group-hover:shadow-sm">
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary-tint group-hover:text-primary">
                <Icon icon="ph:exam" className="size-5" />
              </span>
              <span className="text-xs font-semibold text-foreground">Evaluaciones</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/teacher/materiales" className="group">
          <Card className="h-full border-border/60 transition-all group-hover:border-primary/50 group-hover:shadow-sm">
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary-tint group-hover:text-primary">
                <Icon icon="ph:file-audio" className="size-5" />
              </span>
              <span className="text-xs font-semibold text-foreground">Materiales</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/teacher/perfil" className="group">
          <Card className="h-full border-border/60 transition-all group-hover:border-primary/50 group-hover:shadow-sm">
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary-tint group-hover:text-primary">
                <Icon icon="ph:user-circle" className="size-5" />
              </span>
              <span className="text-xs font-semibold text-foreground">Mi Perfil</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Próximas sesiones
              </CardTitle>
              <CardDescription>Clases programadas para los próximos días.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/teacher/sesiones" className="flex items-center gap-1.5 text-xs">
                Ver todas
                <Icon icon="ph:arrow-right" className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.proximasSesiones.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No tienes sesiones programadas próximamente.
              </p>
            ) : (
              data.proximasSesiones.map((sesion) => (
                <div
                  key={sesion.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/50 p-3.5 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {sesion.catedra}
                      </span>
                      <span className="truncate text-sm font-medium text-foreground">
                        {sesion.curso}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(sesion.fecha)}</span>
                      <span>·</span>
                      <span>
                        {sesion.inicio} – {sesion.fin}
                      </span>
                      {sesion.tema ? (
                        <>
                          <span>·</span>
                          <span className="truncate italic">{sesion.tema}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={SESION_ESTADO_BADGE[sesion.estado].variant}>
                      {SESION_ESTADO_BADGE[sesion.estado].label}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/teacher/sesiones">Gestionar</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Pendientes de calificación
              </CardTitle>
              <CardDescription>Evaluaciones con notas por registrar.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/teacher/evaluaciones" className="flex items-center gap-1.5 text-xs">
                Ver todas
                <Icon icon="ph:arrow-right" className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.pendientesCalificar.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Icon icon="ph:check-circle" className="size-8 text-primary" />
                <p className="mt-2 text-sm font-medium text-foreground">Estás al día</p>
                <p className="text-xs">No tienes evaluaciones con notas pendientes.</p>
              </div>
            ) : (
              data.pendientesCalificar.map((ev) => (
                <div
                  key={ev.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/50 p-3.5 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {ev.catedra}
                      </span>
                      <span className="truncate text-sm font-medium text-foreground">
                        {ev.titulo}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={EVALUACION_TIPO_BADGE[ev.tipo].variant}>
                        {EVALUACION_TIPO_BADGE[ev.tipo].label}
                      </Badge>
                      <span>
                        {ev.rendidas} de {ev.totalEstudiantes} calificados
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/teacher/evaluaciones">Calificar</Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
