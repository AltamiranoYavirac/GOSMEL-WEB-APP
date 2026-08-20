export const topbarQueryKeys = {
  all: ["topbar"] as const,
  summary: () => [...topbarQueryKeys.all, "summary"] as const,
  search: (query: string) => [...topbarQueryKeys.all, "search", query] as const,
};
