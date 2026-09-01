"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateSolicitudEstado } from "../api/updateSolicitudEstado";
import { solicitudesQueryKeys } from "../model/query-keys";
import type { TSolicitudEstado } from "../model/solicitud.types";

export function useUpdateSolicitudEstado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: TSolicitudEstado }) => {
      const { data, error } = await updateSolicitudEstado(id, estado);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: solicitudesQueryKeys.list() });
      toast.success("Solicitud actualizada");
    },
    onError: (error) => toast.error(error.message),
  });
}