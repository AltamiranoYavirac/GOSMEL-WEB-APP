"use client";

import { useQuery } from "@tanstack/react-query";

import { getCatedraEstudiantes } from "../api/getCatedraEstudiantes";

export function useCatedraEstudiantes(catedraId: string, enabled = true) {
  return useQuery({
    queryKey: ["catedras", catedraId, "estudiantes"],
    queryFn: async () => {
      const { data, error } = await getCatedraEstudiantes(catedraId);
      if (error) throw new Error(error);
      return data;
    },
    enabled: Boolean(catedraId) && enabled,
  });
}
