"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateMiEstudiante } from "../api/updateMiEstudiante"
import type { IDatosEstudianteFormValues } from "../model/DatosEstudianteForm.config"
import { miEstudianteQueryKeys } from "../model/query-keys"

export function useUpdateMiEstudiante(perfilId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: IDatosEstudianteFormValues) => {
      const { data, error } = await updateMiEstudiante(perfilId, values)
      if (error || !data) {
        throw new Error(error ?? "No se pudo actualizar tu perfil de estudiante.")
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: miEstudianteQueryKeys.current(perfilId) })
      toast.success("Datos de estudiante actualizados")
    },
    onError: (error) => toast.error(error.message),
  })
}
