export const usuariosQueryKeys = {
  all: ["usuarios"] as const,
  list: () => [...usuariosQueryKeys.all, "list"] as const,
};