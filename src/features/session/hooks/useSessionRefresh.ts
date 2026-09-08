"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { sessionQueryKeys } from "@/entities/user"

import { subscribeToAuthState } from "../api/subscribeToAuthState"

export function useSessionRefresh() {
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(() => {
    const { data } = subscribeToAuthState(() => {
      queryClient.removeQueries({ queryKey: sessionQueryKeys.all })
      router.refresh()
    })

    return () => data?.unsubscribe()
  }, [queryClient, router])
}
