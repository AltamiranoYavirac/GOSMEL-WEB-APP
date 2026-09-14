export const asistenciaQueryKeys = {
  all: ["asistencia"] as const,
  sesion: (sesionId: string) => [...asistenciaQueryKeys.all, "sesion", sesionId] as const,
};
