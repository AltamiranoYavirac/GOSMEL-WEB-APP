"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTipoInstrumento } from "../api/updateTipoInstrumento";
import { instrumentosQueryKeys } from "../model/query-keys";
import type { IUpdateTipoInstrumentoVariables } from "./useUpdateTipoInstrumento.types";

export function useUpdateTipoInstrumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tipoId, values }: IUpdateTipoInstrumentoVariables) => {
      const { data, error } = await updateTipoInstrumento(tipoId, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instrumentosQueryKeys.tipos() });
      queryClient.invalidateQueries({ queryKey: instrumentosQueryKeys.list() });
    },
  });
}
