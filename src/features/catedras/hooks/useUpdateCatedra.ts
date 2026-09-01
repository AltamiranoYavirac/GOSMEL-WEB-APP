"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateCatedra, type IUpdateCatedraInput } from "../api/updateCatedra";
import { catedrasQueryKeys } from "../model/query-keys";

export function useUpdateCatedra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: IUpdateCatedraInput) => {
      const { error } = await updateCatedra(input);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catedrasQueryKeys.all });
      toast.success("Cátedra actualizada correctamente");
    },
    onError: (error) => {
      toast.error(`Error al actualizar cátedra: ${error.message}`);
    },
  });
}
