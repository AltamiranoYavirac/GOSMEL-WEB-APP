export const horariosQueryKeys = {
  all: ["horarios"] as const,
  recurrentes: () => [...horariosQueryKeys.all, "recurrentes"] as const,
  sesiones: () => [...horariosQueryKeys.all, "sesiones"] as const,
};