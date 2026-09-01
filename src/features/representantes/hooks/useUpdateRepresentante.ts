"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateRepresentante } from "../api/updateRepresentante";
import { representantesQueryKeys } from "../model/query-keys";
import type { IUpdateRepresentanteInput } from "../model/representante.types";

export function useUpdateRepresentante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: IUpdateRepresentanteInput) => {
      const { error } = await updateRepresentante(input);
      if (error) throw new Error(error);
      return input.id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: representantesQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: representantesQueryKeys.detail(id) });
      toast.success("Datos del representante actualizados");
    },
    onError: (error) => {
      toast.error(`Error al actualizar representante: ${error.message}`);
    },
  });
}
