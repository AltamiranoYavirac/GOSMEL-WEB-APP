"use client"

import { useEffect, useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { searchPhIcons } from "@/shared/api/iconify"

export function useIconPickerSearch(query: string) {
  const [debounced, setDebounced] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(timeout)
  }, [query])

  return useQuery({
    queryKey: ["iconify-icons", debounced],
    queryFn: () => searchPhIcons(debounced),
    enabled: debounced.length >= 2,
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  })
}
