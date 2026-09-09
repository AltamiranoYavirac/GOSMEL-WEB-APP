"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { resolvePostLoginRoute, sessionQueryKeys } from "@/entities/user"
import { signInWithPassword } from "../api/signInWithPassword"
import { getAuthErrorMessage } from "../model/auth-errors"
import type { IUseLoginParams } from "./useLogin.types"

export function useLogin(nextPath?: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ email, password }: IUseLoginParams) => {
      const { data, error } = await signInWithPassword({ email, password })
      if (error || !data) {
        throw new Error(getAuthErrorMessage(error ?? "unknown_error"))
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: sessionQueryKeys.all })
      router.replace(resolvePostLoginRoute(nextPath, data.roles))
      router.refresh()
    },
  })
}
