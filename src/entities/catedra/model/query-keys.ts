export const catedrasQueryKeys = {
  all: ["catedras"] as const,
  list: () => [...catedrasQueryKeys.all, "list"] as const,
  inscripcionesPendientes: (catedraId: string) =>
    [...catedrasQueryKeys.all, "inscripciones-pendientes", catedraId] as const,
};