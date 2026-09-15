"use client"

import { useQuery } from "@tanstack/react-query"

import { getMiPerfil } from "../api/getMiPerfil"
import { miPerfilQueryKeys } from "../model/query-keys"

export function useMiPerfil(id: string) {
  return useQuery({
    queryKey: miPerfilQueryKeys.current(id),
    queryFn: async () => {
      const { data, error } = await getMiPerfil(id)
      if (error || !data) {
        throw new Error(error ?? "No se pudo cargar tu perfil.")
      }
      return data
    },
  })
}
