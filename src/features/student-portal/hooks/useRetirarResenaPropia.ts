"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { retirarResenaPropia } from "../api/retirarResenaPropia";
import { studentQueryKeys } from "../model/query-keys";

export function useRetirarResenaPropia(estudianteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resenaId: string) => {
      const { error } = await retirarResenaPropia(resenaId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.resenas(estudianteId) });
      toast.success("Reseña retirada");
    },
    onError: (error) => toast.error(error.message),
  });
}
