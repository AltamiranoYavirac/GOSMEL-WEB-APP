"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateInscripcionEstado } from "../api/updateInscripcionEstado";
import { estudiantesQueryKeys } from "../model/query-keys";

export function useUpdateInscripcionEstado(estudianteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inscripcionId, estado }: { inscripcionId: string; estado: "retirada" | "cancelada" }) => {
      const { data, error } = await updateInscripcionEstado(inscripcionId, estado);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...estudiantesQueryKeys.all, "detalle", estudianteId] });
      toast.success("Inscripción actualizada");
    },
    onError: (error) => toast.error(error.message),
  });
}