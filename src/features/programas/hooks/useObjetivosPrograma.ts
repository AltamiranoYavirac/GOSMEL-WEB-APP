"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  agregarObjetivoPrograma,
  eliminarObjetivoPrograma,
  updateOrdenObjetivoPrograma,
} from "../api/programaObjetivos";
import { programasQueryKeys } from "../model/query-keys";
import type { IMoverObjetivoProgramaInput } from "./useObjetivosPrograma.types";

export function useAgregarObjetivoPrograma(programaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ objetivo, orden }: { objetivo: string; orden: number }) => {
      const { error } = await agregarObjetivoPrograma(programaId, objetivo, orden);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...programasQueryKeys.all, "detalle", programaId] });
    },
  });
}

export function useEliminarObjetivoPrograma(programaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (objetivoId: string) => {
      const { error } = await eliminarObjetivoPrograma(objetivoId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...programasQueryKeys.all, "detalle", programaId] });
    },
  });
}

export function useMoverObjetivoPrograma(programaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ origen, destino }: IMoverObjetivoProgramaInput) => {
      const first = await updateOrdenObjetivoPrograma(origen.id, destino.orden);
      if (first.error) throw new Error(first.error);
      const second = await updateOrdenObjetivoPrograma(destino.id, origen.orden);
      if (second.error) throw new Error(second.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...programasQueryKeys.all, "detalle", programaId] });
    },
  });
}
