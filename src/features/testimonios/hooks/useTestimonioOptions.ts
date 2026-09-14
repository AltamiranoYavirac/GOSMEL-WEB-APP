"use client";

import { useQuery } from "@tanstack/react-query";

import { getTestimonioOptions } from "../api/getTestimonioOptions";
import { testimoniosQueryKeys } from "../model/query-keys";

export function useTestimonioOptions(enabled: boolean) {
  return useQuery({
    queryKey: testimoniosQueryKeys.options(),
    queryFn: async () => {
      const { data, error } = await getTestimonioOptions();
      if (error) throw new Error(error);
      return data ?? [];
    },
    enabled,
  });
}
