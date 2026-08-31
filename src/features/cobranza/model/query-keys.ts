export const cobranzaQueryKeys = {
  all: ["cobranza"] as const,
  list: () => [...cobranzaQueryKeys.all, "list"] as const,
};