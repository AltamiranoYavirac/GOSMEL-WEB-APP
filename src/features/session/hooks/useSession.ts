"use client"

import { useQuery } from "@tanstack/react-query"

import { sessionQueryKeys } from "@/entities/user"
import { getSession } from "../api"

export function useSession() {
  return useQuery({
    queryKey: sessionQueryKeys.current(),
    queryFn: async () => {
      const { data, error } = await getSession()
      if (error) throw new Error(error)
      return data
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
