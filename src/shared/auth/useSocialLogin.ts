"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { signInWithProvider, type TAuthProvider } from "./signInWithProvider"

export function useSocialLogin() {
  return useMutation({
    mutationFn: async (provider: TAuthProvider) => {
      const { error } = await signInWithProvider({ provider })
      if (error) {
        throw new Error("No pudimos conectar con el proveedor. Intenta de nuevo.")
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "No pudimos iniciar sesión. Intenta de nuevo."
      )
    },
  })
}