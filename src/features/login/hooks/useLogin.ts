"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { resolveHomeRoute, sessionQueryKeys } from "@/entities/user"
import { signInWithPassword } from "../api"
import { getAuthErrorMessage } from "../model/auth-errors"
import type { IUseLoginParams } from "./useLogin.types"

export function useLogin() {
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
      router.replace(resolveHomeRoute(data.roles))
      router.refresh()
    },
  })
}
