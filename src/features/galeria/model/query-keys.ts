export const galeriaQueryKeys = {
  all: ["galeria"] as const,
  list: () => [...galeriaQueryKeys.all, "list"] as const,
  options: () => [...galeriaQueryKeys.all, "options"] as const,
};