export const representantesQueryKeys = {
  all: ["representantes"] as const,
  list: () => [...representantesQueryKeys.all, "list"] as const,
  detail: (id: string) => [...representantesQueryKeys.all, "detail", id] as const,
  byEstudiante: (id: string) => [...representantesQueryKeys.all, "estudiante", id] as const,
};
