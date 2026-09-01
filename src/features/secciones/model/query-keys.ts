export const seccionesQueryKeys = {
  all: ["secciones"] as const,
  list: () => [...seccionesQueryKeys.all, "list"] as const,
};