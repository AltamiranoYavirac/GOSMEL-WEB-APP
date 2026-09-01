"use client";

import { useQuery } from "@tanstack/react-query";

import { getTestimonios } from "../api/getTestimonios";
import { testimoniosQueryKeys } from "../model/query-keys";

export function useTestimonios() {
  return useQuery({
    queryKey: testimoniosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getTestimonios();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}