"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { catedrasQueryKeys } from "@/entities/catedra";

import { reasignarCatedras, type IReasignarCatedrasInput } from "../api/reasignarCatedras";
import { asignacionesQueryKeys } from "../model/query-keys";

export function useReasignarCatedras() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: IReasignarCatedrasInput) => {
      const { data, error } = await reasignarCatedras(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: asignacionesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: catedrasQueryKeys.all });
      const total = data?.actualizadas ?? variables.catedraIds.length;
      toast.success(total === 1 ? "Cátedra reasignada" : `${total} cátedras reasignadas`);
    },
    onError: (error) => toast.error(error.message),
  });
}
