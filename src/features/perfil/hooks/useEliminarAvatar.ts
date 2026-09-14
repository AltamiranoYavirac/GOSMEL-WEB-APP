"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { sessionQueryKeys } from "@/entities/user"

import { eliminarAvatar } from "../api/eliminarAvatar"

export function useEliminarAvatar() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await eliminarAvatar()
      if (error) throw new Error(error)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.all })
      router.refresh()
      toast.success("Foto de perfil eliminada")
    },
    onError: (error) => toast.error(error.message),
  })
}
