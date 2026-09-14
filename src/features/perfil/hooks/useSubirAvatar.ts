"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { sessionQueryKeys } from "@/entities/user"

import { subirAvatar } from "../api/subirAvatar"

export function useSubirAvatar() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (file: File) => {
      const { data, error } = await subirAvatar(file)
      if (error) throw new Error(error)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.all })
      router.refresh()
      toast.success("Foto de perfil actualizada")
    },
    onError: (error) => toast.error(error.message),
  })
}
