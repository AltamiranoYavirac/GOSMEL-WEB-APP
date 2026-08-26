"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { signUp, type ISignUpParams } from "../api"
import { getRegisterErrorMessage } from "../model/auth-errors"

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (params: ISignUpParams) => {
      const { data, error } = await signUp(params)
      if (error || !data) {
        throw new Error(getRegisterErrorMessage(error ?? "unknown_error"))
      }
      return data
    },
    onSuccess: () => {
      router.replace("/login")
    },
  })
}