"use client"

import { useQuery } from "@tanstack/react-query"

import { getMiEstudiante } from "../api/getMiEstudiante"
import { miEstudianteQueryKeys } from "../model/query-keys"

export function useMiEstudiante(perfilId: string) {
  return useQuery({
    queryKey: miEstudianteQueryKeys.current(perfilId),
    queryFn: async () => {
      const { data, error } = await getMiEstudiante(perfilId)
      if (error) {
        throw new Error(error)
      }
      return data
    },
  })
}
