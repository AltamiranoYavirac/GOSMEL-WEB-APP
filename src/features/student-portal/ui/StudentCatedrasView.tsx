"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type IAdminColumn,
} from "@/shared/ui";

import { useStudentCatedras } from "../hooks/useStudentCatedras";
import { useStudentCurriculum } from "../hooks/useStudentCurriculum";
import { useStudentPortal } from "../hooks/useStudentPortal";
import { useStudentSessions } from "../hooks/useStudentSessions";
import {
  DIAS_SEMANA,
  INSCRIPCION_ESTADO_BADGE,
  NIVEL_CURSO_LABEL,
  type IStudentCatedra,
} from "../model/student-dashboard.types";
import SolicitarMatriculaDialog from "./SolicitarMatriculaDialog";
import StudentCurriculumView from "./StudentCurriculumView";
import StudentNoStudents from "./StudentNoStudents";
import StudentScheduleView from "./StudentScheduleView";

function catedraColumns(): IAdminColumn<IStudentCatedra>[] {
  return [
    {
      key: "codigo",
      label: "Cátedra",
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.codigo}</span>,
    },
    {
      key: "curso",
      label: "Curso",
      render: (row) => <span className="font-medium">{row.curso}</span>,
    },
    {
      key: "docente",
      label: "Docente",
      render: (row) => row.docente ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "horario",
      label: "Horario",
      render: (row) =>
        row.horarios.length > 0 ? (
          <div className="flex flex-col">
            {row.horarios.map((horario, index) => (
              <span key={index} className="text-xs text-muted-foreground">
                {DIAS_SEMANA[horario.dia]} {horario.inicio.slice(0, 5)}–{horario.fin.slice(0, 5)}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "nivel",
      label: "Nivel",
      render: (row) => (row.nivel ? NIVEL_CURSO_LABEL[row.nivel] : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={INSCRIPCION_ESTADO_BADGE[row.estado].variant}>{INSCRIPCION_ESTADO_BADGE[row.estado].label}</Badge>
      ),
    },
  ];
}

export default function StudentCatedrasView() {
  const { isLoading, estudianteActivo } = useStudentPortal();
  const { data: catedras, isPending: catedrasPending } = useStudentCatedras(estudianteActivo?.id ?? null);
  const { data: sesiones, isPending: sesionesPending } = useStudentSessions(estudianteActivo?.id ?? null);
  const { data: planes, isPending: planesPending } = useStudentCurriculum(estudianteActivo?.id ?? null);
  const [solicitudOpen, setSolicitudOpen] = useState(false);

  if (!isLoading && !estudianteActivo) {
    return <StudentNoStudents />;
  }

  if (isLoading || catedrasPending || sesionesPending || planesPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Portal · Estudiante"
        title="Mis cátedras"
        description="Tus clases, su horario y el temario de cada curso."
        icon="ph:chalkboard-teacher"
      >
        <Button onClick={() => setSolicitudOpen(true)}>
          <Icon icon="ph:plus" aria-hidden="true" />
          Solicitar matrícula
        </Button>
      </AdminPageHeader>

      <Tabs defaultValue="catedras">
        <TabsList>
          <TabsTrigger value="catedras">Cátedras</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="temario">Temario</TabsTrigger>
        </TabsList>

        <TabsContent value="catedras" className="space-y-4 pt-2">
          <AdminDataTable
            data={catedras ?? []}
            columns={catedraColumns()}
            loading={false}
            keyId={(row) => row.inscripcionId}
            searchKeys={[(row) => row.codigo, (row) => row.curso, (row) => row.docente ?? ""]}
            emptyTitle="Sin cátedras"
            emptyDescription="Aún no estás inscrito en ninguna cátedra."
            countLabel="cátedras"
          />
          {(catedras ?? []).length === 0 ? (
            <div className="flex justify-center">
              <Button onClick={() => setSolicitudOpen(true)}>
                <Icon icon="ph:plus" aria-hidden="true" />
                Solicitar matrícula
              </Button>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="agenda" className="pt-2">
          <StudentScheduleView proximas={sesiones?.proximas ?? []} pasadas={sesiones?.pasadas ?? []} />
        </TabsContent>

        <TabsContent value="temario" className="pt-2">
          <StudentCurriculumView planes={planes ?? []} />
        </TabsContent>
      </Tabs>

      {solicitudOpen ? (
        <SolicitarMatriculaDialog open={solicitudOpen} onOpenChange={setSolicitudOpen} />
      ) : null}
    </div>
  );
}