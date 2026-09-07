"use client";

import { createContext, useContext } from "react";

import type { IStudentContextEstudiante } from "../model/student-dashboard.types";

export interface IStudentPortalValue {
  isLoading: boolean;
  isRegisteredOnly: boolean;
  estudiantes: IStudentContextEstudiante[];
  estudianteActivo: IStudentContextEstudiante | null;
  setEstudianteActivo: (id: string) => void;
}

export const StudentPortalContext = createContext<IStudentPortalValue | null>(null);

export function useStudentPortal(): IStudentPortalValue {
  const value = useContext(StudentPortalContext);
  if (!value) {
    throw new Error("useStudentPortal debe usarse dentro de StudentPortalProvider");
  }
  return value;
}