export const pagosQueryKeys = {
  all: ["pagos"] as const,
  list: () => [...pagosQueryKeys.all, "list"] as const,
};