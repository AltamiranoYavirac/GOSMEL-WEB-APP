export const estudiantesQueryKeys = {
  all: ["estudiantes"] as const,
  list: () => [...estudiantesQueryKeys.all, "list"] as const,
};