"use client";

import { Icon } from "@iconify/react";

import { AdminPageHeader, Skeleton } from "@/shared/ui";

import { useStudentOverview } from "../hooks/useStudentOverview";
import { useStudentPortal } from "../hooks/useStudentPortal";
import StudentActivityFeed from "./StudentActivityFeed";
import StudentNextClassCard from "./StudentNextClassCard";
import StudentNoStudents from "./StudentNoStudents";
import StudentOverviewCards from "./StudentOverviewCards";

export default function StudentOverviewView() {
  const { isLoading, isRegisteredOnly, estudianteActivo } = useStudentPortal();
  const { data, isPending, isError } = useStudentOverview(estudianteActivo?.id ?? null);

  if (!isLoading && (isRegisteredOnly || !estudianteActivo)) {
    return <StudentNoStudents />;
  }

  if (isLoading || isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
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
        eyebrow="Portal · Estudiante"
        title="Inicio"
        description="Tu actividad académica y financiera de un vistazo."
        icon="ph:squares-four"
      />
      <StudentOverviewCards data={data} />
      <StudentNextClassCard data={data.proximaClase} />
      <StudentActivityFeed items={data.actividades} />
    </div>
  );
}