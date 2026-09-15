"use client"

import { useQuery } from "@tanstack/react-query"

import { getMiRepresentante } from "../api/getMiRepresentante"
import { miRepresentanteQueryKeys } from "../model/query-keys"

export function useMiRepresentante(perfilId: string) {
  return useQuery({
    queryKey: miRepresentanteQueryKeys.current(perfilId),
    queryFn: async () => {
      const { data, error } = await getMiRepresentante(perfilId)
      if (error) {
        throw new Error(error)
      }
      return data
    },
  })
}
