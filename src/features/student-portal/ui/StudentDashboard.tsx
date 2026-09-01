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
import { formatCurrency, formatDate, formatMonthPeriod } from "@/shared/lib/formatters";

import { useStudentDashboard } from "../hooks/useStudentDashboard";
import {
  CUOTA_ESTADO_BADGE,
  DIAS_SEMANA,
  INSCRIPCION_ESTADO_BADGE,
  MATERIAL_TIPO_BADGE,
  type IStudentCuota,
  type IStudentData,
  type IStudentInscripcion,
  type IStudentMaterial,
} from "../model/student-dashboard.types";

interface IStatCardProps {
  icon: string;
  label: string;
  value: string;
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

function inscripcionColumns(): IAdminColumn<IStudentInscripcion>[] {
  return [
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
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={INSCRIPCION_ESTADO_BADGE[row.estado].variant}>
          {INSCRIPCION_ESTADO_BADGE[row.estado].label}
        </Badge>
      ),
    },
  ];
}

function cuotaColumns(): IAdminColumn<IStudentCuota>[] {
  return [
    {
      key: "periodo",
      label: "Período",
      render: (row) => <span className="font-semibold text-primary">{formatMonthPeriod(row.periodo)}</span>,
    },
    {
      key: "monto",
      label: "Monto",
      render: (row) => formatCurrency(row.monto),
    },
    {
      key: "saldo",
      label: "Saldo",
      render: (row) =>
        row.saldo > 0 ? (
          <span className="font-semibold text-destructive">{formatCurrency(row.saldo)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "vencimiento",
      label: "Vencimiento",
      render: (row) => (row.fechaVencimiento ? formatDate(row.fechaVencimiento) : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={CUOTA_ESTADO_BADGE[row.estado].variant}>{CUOTA_ESTADO_BADGE[row.estado].label}</Badge>
      ),
    },
  ];
}

function materialColumns(): IAdminColumn<IStudentMaterial>[] {
  return [
    {
      key: "titulo",
      label: "Material",
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
      label: "Asociado a",
      render: (row) => row.destino ?? <span className="text-muted-foreground">—</span>,
    },
  ];
}

function StudentSections({ estudiante }: { estudiante: IStudentData }) {
  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold text-foreground">{estudiante.nombre}</h3>
      <AdminDataTable
        data={estudiante.inscripciones}
        columns={inscripcionColumns()}
        loading={false}
        keyId={(row) => row.id}
        emptyTitle="Sin inscripciones"
        emptyDescription="Aún no estás inscrito en ninguna cátedra."
        countLabel="inscripciones"
      />
      <AdminDataTable
        data={estudiante.cuotas}
        columns={cuotaColumns()}
        loading={false}
        keyId={(row) => row.id}
        emptyTitle="Sin cuotas"
        emptyDescription="Aún no tienes cuotas generadas."
        countLabel="cuotas"
      />
    </div>
  );
}

export default function StudentDashboard() {
  const { data, isPending } = useStudentDashboard();

  if (isPending) {
    return (
      <div className="space-y-6">
        <AdminPageHeader eyebrow="Portal · Estudiante" title="Mi panel" description="Tus inscripciones, cuotas y materiales." icon="ph:student" />
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

  const { estudiantes } = data;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Portal · Estudiante"
        title={`Hola, ${data.nombre}`}
        description="Esto es lo que tienes en la academia."
        icon="ph:student"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon="ph:chalkboard" label="Inscripciones activas" value={String(data.counts.inscripcionesActivas)} />
        <StatCard icon="ph:receipt" label="Saldo pendiente" value={formatCurrency(data.counts.saldoTotal)} />
        <StatCard icon="ph:warning-circle" label="Cuotas vencidas" value={String(data.counts.cuotasVencidas)} />
      </div>

      {estudiantes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Icon icon="ph:student" className="size-8 text-muted-foreground/60" aria-hidden="true" />
          <p className="font-heading text-lg text-foreground">Sin estudiantes vinculados</p>
          <p className="text-sm text-muted-foreground">
            Si eres representante, vincula a tus hijos para ver su información.
          </p>
        </div>
      ) : estudiantes.length === 1 ? (
        <StudentSections estudiante={estudiantes[0]} />
      ) : (
        <Tabs defaultValue={estudiantes[0].id}>
          <TabsList>
            {estudiantes.map((estudiante) => (
              <TabsTrigger key={estudiante.id} value={estudiante.id}>
                {estudiante.nombre}
              </TabsTrigger>
            ))}
          </TabsList>
          {estudiantes.map((estudiante) => (
            <TabsContent key={estudiante.id} value={estudiante.id} className="pt-2">
              <StudentSections estudiante={estudiante} />
            </TabsContent>
          ))}
        </Tabs>
      )}

      <div>
        <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Materiales disponibles
        </h3>
        <AdminDataTable
          data={data.materiales}
          columns={materialColumns()}
          loading={false}
          keyId={(row) => row.id}
          searchKeys={[(row) => row.titulo, (row) => row.destino ?? ""]}
          emptyTitle="Sin materiales"
          emptyDescription="Los materiales compartidos aparecerán aquí."
          countLabel="materiales"
        />
      </div>
    </div>
  );
}