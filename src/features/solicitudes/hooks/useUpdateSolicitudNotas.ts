"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateSolicitudNotas } from "../api/updateSolicitudNotas";
import { solicitudesQueryKeys } from "../model/query-keys";

export function useUpdateSolicitudNotas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notasInternas }: { id: string; notasInternas: string }) => {
      const { data, error } = await updateSolicitudNotas(id, notasInternas);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: solicitudesQueryKeys.list() });
      toast.success("Notas actualizadas");
    },
    onError: (error) => toast.error(error.message),
  });
}
