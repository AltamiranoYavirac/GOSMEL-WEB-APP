export const estudianteQueryKeys = {
  all: ["estudiante"] as const,
  options: () => [...estudianteQueryKeys.all, "options"] as const,
};
