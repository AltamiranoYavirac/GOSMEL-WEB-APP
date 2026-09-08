"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { signOut } from "../api/signOut"

export function useLogout(redirectTo = "/login") {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const { error } = await signOut()
      if (error) throw new Error(error)
    },
    onSuccess: () => {
      queryClient.clear()
      router.replace(redirectTo)
      router.refresh()
    },
  })
}
