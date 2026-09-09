export const instrumentQueryKeys = {
  all: ["instrument"] as const,
  options: () => [...instrumentQueryKeys.all, "options"] as const,
};
