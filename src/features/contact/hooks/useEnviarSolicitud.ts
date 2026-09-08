"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { enviarSolicitud, type IEnviarSolicitudInput } from "../api/enviarSolicitud"

export function useEnviarSolicitud() {
  return useMutation({
    mutationFn: async (input: IEnviarSolicitudInput) => {
      const { data, error } = await enviarSolicitud(input)
      if (error) throw new Error(error)
      return data
    },
    onError: (error) => toast.error(error.message),
  })
}
