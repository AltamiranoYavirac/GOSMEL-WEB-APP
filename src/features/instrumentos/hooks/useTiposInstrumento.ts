"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getTiposInstrumento, crearTipoInstrumento, eliminarTipoInstrumento } from "../api/getTiposInstrumento";
import type { ITipoInstrumentoFormValues } from "../model/TipoInstrumentoForm.config";
import { instrumentosQueryKeys } from "../model/query-keys";

export function useTiposInstrumento() {
  return useQuery({
    queryKey: instrumentosQueryKeys.tipos(),
    queryFn: async () => {
      const { data, error } = await getTiposInstrumento();
      if (error) throw new Error(error);
      return data;
    },
  });
}

export function useCrearTipoInstrumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ITipoInstrumentoFormValues) => {
      const { data, error } = await crearTipoInstrumento(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instrumentosQueryKeys.tipos() });
    },
  });
}

export function useEliminarTipoInstrumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tipoId: string) => {
      const { error } = await eliminarTipoInstrumento(tipoId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instrumentosQueryKeys.tipos() });
    },
  });
}
