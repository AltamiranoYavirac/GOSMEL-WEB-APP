export const asignacionesQueryKeys = {
  all: ["asignaciones"] as const,
  list: () => [...asignacionesQueryKeys.all, "list"] as const,
};
