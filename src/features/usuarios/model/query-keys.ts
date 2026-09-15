export const usuariosQueryKeys = {
  all: ["usuarios"] as const,
  list: () => [...usuariosQueryKeys.all, "list"] as const,
  perfilActual: () => [...usuariosQueryKeys.all, "perfil-actual"] as const,
};