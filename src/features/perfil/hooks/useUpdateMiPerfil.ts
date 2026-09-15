"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { sessionQueryKeys } from "@/entities/user"

import { updateMiPerfil } from "../api/updateMiPerfil"
import type { IDatosCuentaFormValues } from "../model/DatosCuentaForm.config"
import { miPerfilQueryKeys } from "../model/query-keys"

export function useUpdateMiPerfil(id: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (values: IDatosCuentaFormValues) => {
      const { data, error } = await updateMiPerfil(id, values)
      if (error || !data) {
        throw new Error(error ?? "No se pudo actualizar tu perfil.")
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: miPerfilQueryKeys.current(id) })
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.all })
      router.refresh()
      toast.success("Datos de la cuenta actualizados")
    },
    onError: (error) => toast.error(error.message),
  })
}
