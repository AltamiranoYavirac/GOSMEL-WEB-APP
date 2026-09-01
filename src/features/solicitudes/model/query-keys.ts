export const solicitudesQueryKeys = {
  all: ["solicitudes"] as const,
  list: () => [...solicitudesQueryKeys.all, "list"] as const,
};