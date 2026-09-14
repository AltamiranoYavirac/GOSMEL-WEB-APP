export const acuerdosQueryKeys = {
  all: ["acuerdos"] as const,
  list: () => [...acuerdosQueryKeys.all, "list"] as const,
  cuotasParaCierre: (acuerdoId: string) => [...acuerdosQueryKeys.all, "cierre", acuerdoId] as const,
};
