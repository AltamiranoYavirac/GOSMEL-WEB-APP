"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateDocente } from "../api/updateDocente";
import { docentesQueryKeys } from "../model/query-keys";

export function useUpdateDocente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: { publicado?: boolean; destacado?: boolean } }) => {
      const { data, error } = await updateDocente(id, patch);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docentesQueryKeys.list() });
    },
    onError: (error) => toast.error(error.message),
  });
}