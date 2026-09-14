"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { persistCloudinaryImage } from "@/shared/api/persist-cloudinary-image";

import { crearPrograma } from "../api/crearPrograma";
import type { IProgramaFormValues } from "../model/ProgramaForm.config";
import { programasQueryKeys } from "../model/query-keys";

export function useCrearPrograma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IProgramaFormValues) => {
      const result = await persistCloudinaryImage({
        file: values.imagenArchivo,
        folder: "gosmel/programas",
        persist: (publicId) => crearPrograma(values, publicId),
      });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programasQueryKeys.list() });
    },
  });
}
