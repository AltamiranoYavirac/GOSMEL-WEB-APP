"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { vincularRepresentante, type IVincularRepresentanteInput } from "../api/vincularRepresentante";
import { estudiantesQueryKeys } from "../model/query-keys";

export function useVincularRepresentante() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: IVincularRepresentanteInput) => {
      const { error } = await vincularRepresentante(input);
      if (error) throw new Error(error);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: estudiantesQueryKeys.all }); toast.success("Representante vinculado"); },
    onError: (error) => toast.error(error.message),
  });
}
