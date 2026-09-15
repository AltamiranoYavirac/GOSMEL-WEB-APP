"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { editarResenaPropia } from "../api/editarResenaPropia";
import type { ICrearResenaFormValues } from "../model/CrearResenaForm.config";
import { studentQueryKeys } from "../model/query-keys";

export function useEditarResenaPropia(estudianteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resenaId, values }: { resenaId: string; values: ICrearResenaFormValues }) => {
      const { error } = await editarResenaPropia(resenaId, values);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.resenas(estudianteId) });
      toast.success("Reseña actualizada, quedó en espera de moderación");
    },
    onError: (error) => toast.error(error.message),
  });
}
