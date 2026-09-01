export const instrumentosQueryKeys = {
  all: ["instrumentos"] as const,
  list: () => [...instrumentosQueryKeys.all, "list"] as const,
  tipos: () => [...instrumentosQueryKeys.all, "tipos"] as const,
};
