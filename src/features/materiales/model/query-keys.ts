export const materialesQueryKeys = {
  all: ["materiales"] as const,
  list: () => [...materialesQueryKeys.all, "list"] as const,
};