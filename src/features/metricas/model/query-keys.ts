export const metricasQueryKeys = {
  all: ["metricas"] as const,
  list: () => [...metricasQueryKeys.all, "list"] as const,
};