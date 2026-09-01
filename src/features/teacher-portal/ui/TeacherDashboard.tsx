"use client";

import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Card,
  CardContent,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type IAdminColumn,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useTeacherDashboard } from "../hooks/useTeacherDashboard";
import {
  CATEDRA_ESTADO_BADGE,
  DIAS_SEMANA,
  EVALUACION_TIPO_BADGE,
  MATERIAL_TIPO_BADGE,
  MODALIDAD_BADGE,
  SESION_ESTADO_BADGE,
  type ITeacherCatedra,
  type ITeacherDashboard,
  type ITeacherEstudiante,
  type ITeacherEvaluacion,
  type ITeacherMaterial,
  type ITeacherSesion,
} from "../model/teacher-dashboard.types";

interface IStatCardProps {
  icon: string;
  label: string;
  value: number;
}

function StatCard({ icon, label, value }: IStatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
          <Icon icon={icon} className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl font-semibold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeacherDashboard() {
  const { data, isPending } = useTeacherDashboard();

  if (isPending) {
    return (
      <div className="space-y-6">
        <AdminPageHeader eyebrow="Portal · Docente" title="Mi panel" description="Tus cátedras, sesiones y materiales." icon="ph:chalkboard-teacher" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
        <Icon icon="ph:warning-circle" width={32} height={32} className="text-destructive" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">No se pudieron cargar los datos del panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Portal · Docente"
        title={`Hola, ${data.nombre}`}
        description="Esto es lo que tienes asignado en la academia."
        icon="ph:chalkboard-teacher"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon="ph:chalkboard" label="Mis cátedras" value={data.counts.catedrasActivas} />
        <StatCard icon="ph:calendar-check" label="Sesiones de hoy" value={data.counts.sesionesHoy} />
        <StatCard icon="ph:student" label="Mis estudiantes" value={data.counts.inscritos} />
      </div>

      <Tabs defaultValue="estudiantes">
        <TabsList>
          <TabsTrigger value="estudiantes">Mis Estudiantes</TabsTrigger>
          <TabsTrigger value="catedras">Cátedras</TabsTrigger>
          <TabsTrigger value="sesiones">Sesiones</TabsTrigger>
          <TabsTrigger value="materiales">Materiales</TabsTrigger>
          <TabsTrigger value="evaluaciones">Evaluaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="estudiantes" className="pt-2">
          <EstudiantesTab estudiantes={data.estudiantes} />
        </TabsContent>
        <TabsContent value="catedras" className="pt-2">
          <CatedrasTab data={data} />
        </TabsContent>
        <TabsContent value="sesiones" className="pt-2">
          <SesionesTab sesiones={data.sesiones} />
        </TabsContent>
        <TabsContent value="materiales" className="pt-2">
          <MaterialesTab materiales={data.materiales} />
        </TabsContent>
        <TabsContent value="evaluaciones" className="pt-2">
          <EvaluacionesTab evaluaciones={data.evaluaciones} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EstudiantesTab({ estudiantes }: { estudiantes: ITeacherEstudiante[] }) {
  const columns: IAdminColumn<ITeacherEstudiante>[] = [
    {
      key: "nombre",
      label: "Estudiante",
      render: (row) => (
        <div className="flex min-w-0 flex-col">
          <span className="font-semibold text-foreground">{row.nombre}</span>
          {row.email ? <span className="truncate text-xs text-muted-foreground">{row.email}</span> : null}
        </div>
      ),
    },
    {
      key: "curso",
      label: "Curso / Cátedra",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-xs text-foreground">{row.cursoNombre}</span>
          <span className="font-mono text-[10px] text-primary">{row.catedraCodigo}</span>
        </div>
      ),
    },
    {
      key: "contacto",
      label: "Contacto",
      render: (row) => row.celular ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "fecha",
      label: "Fecha Inscripción",
      render: (row) => <span className="text-xs text-muted-foreground">{formatDate(row.fechaInscripcion)}</span>,
    },
  ];

  return (
    <AdminDataTable
      data={estudiantes}
      columns={columns}
      loading={false}
      keyId={(row) => `${row.id}-${row.catedraCodigo}`}
      searchKeys={[(row) => row.nombre, (row) => row.cursoNombre, (row) => row.catedraCodigo]}
      emptyTitle="Sin estudiantes inscritos"
      emptyDescription="Cuando la administración asigne estudiantes a tus cátedras aparecerán aquí."
      countLabel="estudiantes"
    />
  );
}

function CatedrasTab({ data }: { data: ITeacherDashboard }) {
  const columns: IAdminColumn<ITeacherCatedra>[] = [
    {
      key: "codigo",
      label: "Código",
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.codigo}</span>,
    },
    {
      key: "curso",
      label: "Curso",
      render: (row) => <span className="font-medium">{row.curso}</span>,
    },
    {
      key: "horario",
      label: "Horario",
      render: (row) =>
        row.horarios.length > 0 ? (
          <div className="flex flex-col">
            {row.horarios.map((horario, index) => (
              <span key={index} className="text-xs text-muted-foreground">
                {DIAS_SEMANA[horario.dia]} {horario.inicio}–{horario.fin}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "modalidad",
      label: "Modalidad",
      render: (row) => (
        <Badge variant={MODALIDAD_BADGE[row.modalidad].variant}>{MODALIDAD_BADGE[row.modalidad].label}</Badge>
      ),
    },
    {
      key: "cupo",
      label: "Inscritos",
      render: (row) => (
        <span className="text-muted-foreground">
          {row.inscritos} / {row.cupoMaximo}
        </span>
      ),
    },
    {
      key: "aula",
      label: "Aula",
      render: (row) => row.aula ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={CATEDRA_ESTADO_BADGE[row.estado].variant}>{CATEDRA_ESTADO_BADGE[row.estado].label}</Badge>
      ),
    },
  ];

  return (
    <AdminDataTable
      data={data.catedras}
      columns={columns}
      loading={false}
      keyId={(row) => row.id}
      searchKeys={[(row) => row.codigo, (row) => row.curso]}
      emptyTitle="Sin cátedras asignadas"
      emptyDescription="Cuando el administrador te asigne cátedras aparecerán aquí."
      countLabel="cátedras"
    />
  );
}

function SesionesTab({ sesiones }: { sesiones: ITeacherSesion[] }) {
  const columns: IAdminColumn<ITeacherSesion>[] = [
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
      render: (row) => formatDate(row.fecha),
    },
    {
      key: "horario",
      label: "Horario",
      render: (row) => `${row.inicio}–${row.fin}`,
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
            {row.presentes}/{row.totalAsistencia}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
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
    <AdminDataTable
      data={sesiones}
      columns={columns}
      loading={false}
      keyId={(row) => row.id}
      searchKeys={[(row) => row.catedra, (row) => row.curso, (row) => row.tema ?? ""]}
      emptyTitle="Sin sesiones programadas"
      emptyDescription="Las sesiones del calendario aparecerán aquí."
      countLabel="sesiones"
    />
  );
}

function MaterialesTab({ materiales }: { materiales: ITeacherMaterial[] }) {
  const columns: IAdminColumn<ITeacherMaterial>[] = [
    {
      key: "titulo",
      label: "Título",
      render: (row) => <span className="font-medium">{row.titulo}</span>,
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (row) => (
        <Badge variant={MATERIAL_TIPO_BADGE[row.tipo].variant}>{MATERIAL_TIPO_BADGE[row.tipo].label}</Badge>
      ),
    },
    {
      key: "destino",
      label: "Curso / Cátedra",
      render: (row) => row.destino ?? <span className="text-muted-foreground">General</span>,
    },
    {
      key: "visibilidad",
      label: "Visibilidad",
      render: (row) => <span className="capitalize text-muted-foreground">{row.visibilidad}</span>,
    },
  ];

  return (
    <AdminDataTable
      data={materiales}
      columns={columns}
      loading={false}
      keyId={(row) => row.id}
      searchKeys={[(row) => row.titulo, (row) => row.destino ?? ""]}
      emptyTitle="Sin materiales"
      emptyDescription="Los materiales que subas para tus clases aparecerán aquí."
      countLabel="materiales"
    />
  );
}

function EvaluacionesTab({ evaluaciones }: { evaluaciones: ITeacherEvaluacion[] }) {
  const columns: IAdminColumn<ITeacherEvaluacion>[] = [
    {
      key: "titulo",
      label: "Título",
      render: (row) => <span className="font-medium">{row.titulo}</span>,
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (row) => (
        <Badge variant={EVALUACION_TIPO_BADGE[row.tipo].variant}>{EVALUACION_TIPO_BADGE[row.tipo].label}</Badge>
      ),
    },
    {
      key: "catedra",
      label: "Cátedra",
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.catedra}</span>,
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => (row.fecha ? formatDate(row.fecha) : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "ponderacion",
      label: "Ponderación",
      render: (row) => `${row.ponderacion}%`,
    },
    {
      key: "promedio",
      label: "Promedio",
      render: (row) =>
        row.promedio != null ? (
          <span className="font-medium">
            {row.promedio}/{row.notaMaxima}
          </span>
        ) : (
          <span className="text-muted-foreground">Sin calificar</span>
        ),
    },
  ];

  return (
    <AdminDataTable
      data={evaluaciones}
      columns={columns}
      loading={false}
      keyId={(row) => row.id}
      searchKeys={[(row) => row.titulo, (row) => row.catedra]}
      emptyTitle="Sin evaluaciones"
      emptyDescription="Las evaluaciones que programes para tus cursos aparecerán aquí."
      countLabel="evaluaciones"
    />
  );
}