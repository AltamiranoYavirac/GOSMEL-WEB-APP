"use client";

import { useQuery } from "@tanstack/react-query";
import { getRepresentanteDetalle } from "../api/getRepresentanteDetalle";
import { representantesQueryKeys } from "../model/query-keys";

export function useRepresentanteDetalle(id: string | null) {
  return useQuery({
    queryKey: id ? representantesQueryKeys.detail(id) : ["representantes", "detail", "empty"],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await getRepresentanteDetalle(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
