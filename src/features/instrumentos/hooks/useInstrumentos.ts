"use client";

import { useQuery } from "@tanstack/react-query";

import { getInstrumentos } from "../api/getInstrumentos";
import { instrumentosQueryKeys } from "../model/query-keys";

export function useInstrumentos() {
  return useQuery({
    queryKey: instrumentosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getInstrumentos();
      if (error) throw new Error(error);
      return data;
    },
  });
}
