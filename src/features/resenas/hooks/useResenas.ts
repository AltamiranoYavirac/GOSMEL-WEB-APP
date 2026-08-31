"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getResenas } from "../api/getResenas";
import { updateResenaPublicado, eliminarResena } from "../api/updateResenaPublicado";
import { resenasQueryKeys } from "../model/query-keys";

export function useResenas() {
  return useQuery({
    queryKey: resenasQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getResenas();
      if (error) throw new Error(error);
      return data;
    },
  });
}

export function useUpdateResenaPublicado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resenaId, publicado }: { resenaId: string; publicado: boolean }) => {
      const { error } = await updateResenaPublicado(resenaId, publicado);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resenasQueryKeys.list() });
    },
  });
}

export function useEliminarResena() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resenaId: string) => {
      const { error } = await eliminarResena(resenaId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resenasQueryKeys.list() });
    },
  });
}
