export const acuerdosQueryKeys = {
  all: ["acuerdos"] as const,
  list: () => [...acuerdosQueryKeys.all, "list"] as const,
};