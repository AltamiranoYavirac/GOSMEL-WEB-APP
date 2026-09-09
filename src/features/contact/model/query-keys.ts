export const contactQueryKeys = {
  all: ["contact"] as const,
  solicitud: () => [...contactQueryKeys.all, "solicitud"] as const,
}
