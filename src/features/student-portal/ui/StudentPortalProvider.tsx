"use client";

import { useMemo, useState, type ReactNode } from "react";

import { useStudentContext } from "../hooks/useStudentContext";
import { StudentPortalContext, type IStudentPortalValue } from "../hooks/useStudentPortal";

export default function StudentPortalProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useStudentContext();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const estudiantes = useMemo(() => data?.estudiantes ?? [], [data]);
  const isRegisteredOnly = useMemo(() => {
    const roles = data?.roles ?? [];
    return !roles.includes("estudiante") && !roles.includes("representante");
  }, [data]);
  const estudianteActivo = useMemo(
    () => estudiantes.find((estudiante) => estudiante.id === selectedId) ?? estudiantes[0] ?? null,
    [estudiantes, selectedId]
  );

  const value = useMemo<IStudentPortalValue>(
    () => ({
      isLoading,
      isRegisteredOnly,
      estudiantes,
      estudianteActivo,
      setEstudianteActivo: (id: string) => setSelectedId(id),
    }),
    [isLoading, isRegisteredOnly, estudiantes, estudianteActivo]
  );

  return <StudentPortalContext.Provider value={value}>{children}</StudentPortalContext.Provider>;
}