"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  type IAdminColumn,
} from "@/shared/ui";

import { useTeacherCatedras } from "../hooks/useTeacherCatedras";
import {
  CATEDRA_ESTADO_BADGE,
  DIAS_SEMANA,
  MODALIDAD_BADGE,
  type ITeacherCatedra,
} from "../model/teacher-dashboard.types";
import CursoTemarioSheet from "./CursoTemarioSheet";
import type { ITeacherCatedrasViewProps } from "./TeacherCatedrasView.types";

export default function TeacherCatedrasView({ className }: ITeacherCatedrasViewProps) {
  const { data = [], isPending } = useTeacherCatedras();
  const [selectedCurso, setSelectedCurso] = useState<{ id: string; nombre: string } | null>(null);

  const columns: IAdminColumn<ITeacherCatedra>[] = [
    {
      key: "codigo",
      label: "Código",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary">{row.codigo}</span>
      ),
    },
    {
      key: "curso",
      label: "Curso",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.curso}</span>
        </div>
      ),
    },
    {
      key: "horario",
      label: "Horarios",
      render: (row) =>
        row.horarios.length > 0 ? (
          <div className="flex flex-col gap-1">
            {row.horarios.map((horario, index) => (
              <span key={index} className="text-xs text-muted-foreground">
                {DIAS_SEMANA[horario.dia]} {horario.inicio}–{horario.fin}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "modalidad",
      label: "Modalidad",
      render: (row) => (
        <Badge variant={MODALIDAD_BADGE[row.modalidad].variant}>
          {MODALIDAD_BADGE[row.modalidad].label}
        </Badge>
      ),
    },
    {
      key: "cupo",
      label: "Inscritos / Cupo",
      render: (row) => (
        <span className="font-medium text-xs text-foreground">
          {row.inscritos} / {row.cupoMaximo}
        </span>
      ),
    },
    {
      key: "aula",
      label: "Aula",
      render: (row) => (
        <span className="text-xs text-muted-foreground">{row.aula ?? "—"}</span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={CATEDRA_ESTADO_BADGE[row.estado].variant}>
          {CATEDRA_ESTADO_BADGE[row.estado].label}
        </Badge>
      ),
    },
    {
      key: "acciones",
      label: "Temario",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCurso({ id: row.cursoId, nombre: row.curso })}
          className="flex items-center gap-1.5"
        >
          <Icon icon="ph:book-open-text" className="size-4 text-primary" />
          Ver temario
        </Button>
      ),
    },
  ];

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      <AdminPageHeader
        eyebrow="Portal · Docente"
        title="Mis Cátedras"
        description="Cátedras asignadas a tu cargo, sus horarios programados, capacidad de estudiantes y consulta de temario oficial (D-12)."
        icon="ph:chalkboard"
      />

      <AdminDataTable
        data={data}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.codigo, (row) => row.curso]}
        emptyTitle="Sin cátedras asignadas"
        emptyDescription="Cuando la administración académica te asigne cátedras aparecerán aquí."
        countLabel="cátedras"
      />

      {selectedCurso ? (
        <CursoTemarioSheet
          cursoId={selectedCurso.id}
          cursoNombre={selectedCurso.nombre}
          open={Boolean(selectedCurso)}
          onOpenChange={(open) => {
            if (!open) setSelectedCurso(null);
          }}
        />
      ) : null}
    </div>
  );
}
