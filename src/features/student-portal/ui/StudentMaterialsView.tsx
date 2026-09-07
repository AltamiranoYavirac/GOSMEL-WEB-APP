"use client";

import { Icon } from "@iconify/react";

import { AdminPageHeader, Skeleton, Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";

import { useStudentMaterials } from "../hooks/useStudentMaterials";
import { useStudentPortal } from "../hooks/useStudentPortal";
import type { TTipoMaterial } from "../model/student-dashboard.types";
import StudentMaterialCard from "./StudentMaterialCard";
import StudentNoStudents from "./StudentNoStudents";

const GRUPOS: { key: string; label: string; tipos: TTipoMaterial[] }[] = [
  { key: "partituras", label: "Partituras", tipos: ["partitura", "pdf"] },
  { key: "audios", label: "Audios", tipos: ["audio"] },
  { key: "videos", label: "Videos", tipos: ["video"] },
  { key: "enlaces", label: "Enlaces", tipos: ["enlace"] },
];

export default function StudentMaterialsView() {
  const { isLoading, estudianteActivo } = useStudentPortal();
  const { data: materiales, isPending } = useStudentMaterials(estudianteActivo?.id ?? null);

  if (!isLoading && !estudianteActivo) {
    return <StudentNoStudents />;
  }

  if (isLoading || isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const total = materiales?.length ?? 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Portal · Estudiante"
        title="Recursos"
        description="Partituras, pistas de acompañamiento y materiales de tus cátedras."
        icon="ph:books"
      />

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Icon icon="ph:folder-open" className="size-8 text-muted-foreground/60" aria-hidden="true" />
          <p className="font-heading text-lg text-foreground">Sin materiales</p>
          <p className="text-sm text-muted-foreground">Los materiales compartidos por tus docentes aparecerán aquí.</p>
        </div>
      ) : (
        <Tabs defaultValue="partituras">
          <TabsList>
            {GRUPOS.map((grupo) => (
              <TabsTrigger key={grupo.key} value={grupo.key}>
                {grupo.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {GRUPOS.map((grupo) => {
            const items = (materiales ?? []).filter((material) => grupo.tipos.includes(material.tipo));
            return (
              <TabsContent key={grupo.key} value={grupo.key} className="pt-2">
                {items.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No hay {grupo.label.toLowerCase()} disponibles.</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {items.map((material) => (
                      <StudentMaterialCard key={material.id} material={material} />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}