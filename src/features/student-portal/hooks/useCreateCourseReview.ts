"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createCourseReview } from "../api/createCourseReview";
import { studentQueryKeys } from "../model/query-keys";
import type { ICrearResenaFormValues } from "../model/CrearResenaForm.config";

export function useCreateCourseReview(estudianteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ICrearResenaFormValues) => {
      const { data, error } = await createCourseReview(estudianteId, values);
      if (error || !data) throw new Error(error ?? "No se pudo publicar la reseña");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.resenas(estudianteId) });
      toast.success("Reseña enviada, quedó en espera de moderación");
    },
    onError: (error) => toast.error(error.message),
  });
}