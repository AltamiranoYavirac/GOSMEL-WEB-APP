export const miPerfilQueryKeys = {
  all: ["mi-perfil"] as const,
  current: (id: string) => [...miPerfilQueryKeys.all, id] as const,
}

export const miEstudianteQueryKeys = {
  all: ["mi-estudiante"] as const,
  current: (perfilId: string) => [...miEstudianteQueryKeys.all, perfilId] as const,
}

export const miRepresentanteQueryKeys = {
  all: ["mi-representante"] as const,
  current: (perfilId: string) => [...miRepresentanteQueryKeys.all, perfilId] as const,
}
