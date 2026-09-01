"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { crearInstrumento, updateInstrumento, eliminarInstrumento } from "../api/crearInstrumento";
import type { IInstrumentoFormValues } from "../model/InstrumentoForm.config";
import { instrumentosQueryKeys } from "../model/query-keys";

export function useCrearInstrumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IInstrumentoFormValues) => {
      const { data, error } = await crearInstrumento(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instrumentosQueryKeys.list() });
    },
  });
}

export function useUpdateInstrumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ instrumentoId, values }: { instrumentoId: string; values: IInstrumentoFormValues }) => {
      const { data, error } = await updateInstrumento(instrumentoId, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instrumentosQueryKeys.list() });
    },
  });
}

export function useEliminarInstrumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (instrumentoId: string) => {
      const { error } = await eliminarInstrumento(instrumentoId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instrumentosQueryKeys.list() });
    },
  });
}
