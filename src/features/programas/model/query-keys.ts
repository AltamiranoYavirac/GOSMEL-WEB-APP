export const programasQueryKeys = {
  all: ["programas"] as const,
  list: () => [...programasQueryKeys.all, "list"] as const,
};