export const representantesQueryKeys = {
  all: ["representantes"] as const,
  list: () => [...representantesQueryKeys.all, "list"] as const,
};