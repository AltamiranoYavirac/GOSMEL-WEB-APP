export const docentesQueryKeys = {
  all: ["docentes"] as const,
  list: () => [...docentesQueryKeys.all, "list"] as const,
};