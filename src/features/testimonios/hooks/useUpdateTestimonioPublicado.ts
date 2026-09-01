"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateTestimonioPublicado } from "../api/updateTestimonioPublicado";
import { testimoniosQueryKeys } from "../model/query-keys";

export function useUpdateTestimonioPublicado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, publicado }: { id: string; publicado: boolean }) => {
      const { data, error } = await updateTestimonioPublicado(id, publicado);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimoniosQueryKeys.list() });
    },
    onError: (error) => toast.error(error.message),
  });
}