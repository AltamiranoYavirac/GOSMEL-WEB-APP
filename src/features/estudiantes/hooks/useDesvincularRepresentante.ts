"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { desvincularRepresentante } from "../api/desvincularRepresentante";
import { estudiantesQueryKeys } from "../model/query-keys";

export function useDesvincularRepresentante() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ estudianteId, representanteId }: { estudianteId: string; representanteId: string }) => {
      const { error } = await desvincularRepresentante(estudianteId, representanteId);
      if (error) throw new Error(error);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: estudiantesQueryKeys.all }); toast.success("Representante desvinculado"); },
    onError: (error) => toast.error(error.message),
  });
}
