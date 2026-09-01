export const cursosQueryKeys = {
  all: ["cursos"] as const,
  list: () => [...cursosQueryKeys.all, "list"] as const,
};