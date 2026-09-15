"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateMiRepresentante } from "../api/updateMiRepresentante"
import type { IDatosRepresentanteFormValues } from "../model/DatosRepresentanteForm.config"
import { miRepresentanteQueryKeys } from "../model/query-keys"

export function useUpdateMiRepresentante(perfilId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: IDatosRepresentanteFormValues) => {
      const { data, error } = await updateMiRepresentante(perfilId, values)
      if (error || !data) {
        throw new Error(error ?? "No se pudo actualizar tu perfil de representante.")
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: miRepresentanteQueryKeys.current(perfilId) })
      toast.success("Datos de representante actualizados")
    },
    onError: (error) => toast.error(error.message),
  })
}
