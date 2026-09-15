"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { persistCloudinaryImage } from "@/shared/api/persist-cloudinary-image";

import { crearGaleriaMedio } from "../api/crearGaleriaMedio";
import type { IGaleriaFormValues } from "../model/GaleriaForm.config";
import { galeriaQueryKeys } from "../model/query-keys";

export function useCrearGaleriaMedio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IGaleriaFormValues) => {
      const result = await persistCloudinaryImage({
        file: values.archivo,
        folder: "gosmel/galeria",
        meta: { displayName: `Galería - ${values.titulo || values.textoAlt}`, tags: [`galeria:${values.categoria}`] },
        persist: (publicId) => crearGaleriaMedio(values, publicId),
      });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: galeriaQueryKeys.list() }),
  });
}
