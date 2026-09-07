export const studentQueryKeys = {
  all: ["student-portal"] as const,
  context: () => [...studentQueryKeys.all, "context"] as const,
  overview: (estudianteId: string) => [...studentQueryKeys.all, "overview", estudianteId] as const,
  catedras: (estudianteId: string) => [...studentQueryKeys.all, "catedras", estudianteId] as const,
  sesiones: (estudianteId: string) => [...studentQueryKeys.all, "sesiones", estudianteId] as const,
  curriculum: (estudianteId: string) => [...studentQueryKeys.all, "curriculum", estudianteId] as const,
  notas: (estudianteId: string) => [...studentQueryKeys.all, "notas", estudianteId] as const,
  asistencias: (estudianteId: string) => [...studentQueryKeys.all, "asistencias", estudianteId] as const,
  practica: (estudianteId: string) => [...studentQueryKeys.all, "practica", estudianteId] as const,
  materiales: (estudianteId: string) => [...studentQueryKeys.all, "materiales", estudianteId] as const,
  finanzas: (estudianteId: string) => [...studentQueryKeys.all, "finanzas", estudianteId] as const,
  certificados: (estudianteId: string) => [...studentQueryKeys.all, "certificados", estudianteId] as const,
  resenas: (estudianteId: string) => [...studentQueryKeys.all, "resenas", estudianteId] as const,
  favoritos: () => [...studentQueryKeys.all, "favoritos"] as const,
  catedrasDisponibles: (estudianteId?: string | null) =>
    [...studentQueryKeys.all, "catedras-disponibles", estudianteId ?? "all"] as const,
};