export const cuotasQueryKeys = {
  all: ["cuotas"] as const,
  list: () => [...cuotasQueryKeys.all, "list"] as const,
};