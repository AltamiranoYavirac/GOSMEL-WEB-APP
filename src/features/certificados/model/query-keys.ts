export const certificadosQueryKeys = {
  all: ["certificados"] as const,
  list: () => [...certificadosQueryKeys.all, "list"] as const,
};
