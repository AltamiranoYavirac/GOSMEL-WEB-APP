export const matriculasQueryKeys = {
  all: ["matriculas"] as const,
  pendientes: (catedraId?: string) =>
    [...matriculasQueryKeys.all, "pendientes", catedraId ?? "todas"] as const,
};
