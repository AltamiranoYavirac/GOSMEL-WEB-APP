export const cursosQueryKeys = {
  all: ["cursos"] as const,
  list: () => [...cursosQueryKeys.all, "list"] as const,
  detail: (id: string) => [...cursosQueryKeys.all, "detail", id] as const,
};