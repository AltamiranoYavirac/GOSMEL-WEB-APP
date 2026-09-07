export const teacherQueryKeys = {
  all: ["teacher-portal"] as const,
  dashboard: () => [...teacherQueryKeys.all, "dashboard"] as const,
  catedras: () => [...teacherQueryKeys.all, "catedras"] as const,
  cursoTemario: (cursoId: string) => [...teacherQueryKeys.all, "curso-temario", cursoId] as const,
  estudiantes: () => [...teacherQueryKeys.all, "estudiantes"] as const,
  estudianteAsistencias: (inscripcionId: string) =>
    [...teacherQueryKeys.all, "estudiante-asistencias", inscripcionId] as const,
  sesiones: () => [...teacherQueryKeys.all, "sesiones"] as const,
  sesionAsistencia: (sesionId: string) => [...teacherQueryKeys.all, "sesion-asistencia", sesionId] as const,
  evaluaciones: () => [...teacherQueryKeys.all, "evaluaciones"] as const,
  calificaciones: (evaluacionId: string) => [...teacherQueryKeys.all, "calificaciones", evaluacionId] as const,
  materiales: () => [...teacherQueryKeys.all, "materiales"] as const,
  perfil: () => [...teacherQueryKeys.all, "perfil"] as const,
  catalogos: () => [...teacherQueryKeys.all, "catalogos"] as const,
};