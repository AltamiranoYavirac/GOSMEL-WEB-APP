export const evaluacionesQueryKeys = {
  all: ["evaluaciones"] as const,
  list: () => [...evaluacionesQueryKeys.all, "list"] as const,
};