"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateCurso } from "../api/updateCurso";
import { cursosQueryKeys } from "../model/query-keys";

export function useUpdateCurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: { publicado?: boolean; destacado?: boolean } }) => {
      const { data, error } = await updateCurso(id, patch);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cursosQueryKeys.list() });
    },
    onError: (error) => toast.error(error.message),
  });
}