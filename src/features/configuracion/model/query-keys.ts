export const configuracionQueryKeys = {
  all: ["configuracion"] as const,
  detail: () => [...configuracionQueryKeys.all, "detail"] as const,
};