"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { persistCloudinaryImage } from "@/shared/api/persist-cloudinary-image";

import { updateGaleriaMedio } from "../api/updateGaleriaMedio";
import { galeriaQueryKeys } from "../model/query-keys";
import type { IUpdateGaleriaMedioInput } from "./useUpdateGaleriaMedio.types";

export function useUpdateGaleriaMedio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values, currentPublicId }: IUpdateGaleriaMedioInput) => {
      const result = await persistCloudinaryImage({
        file: values.archivo,
        folder: "gosmel/galeria",
        currentPublicId,
        meta: { displayName: `Galería - ${values.titulo || values.textoAlt}`, tags: [`galeria:${id}`] },
        persist: (publicId) => updateGaleriaMedio(id, values, publicId),
      });
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: galeriaQueryKeys.list() });
      if (result.cleanupError) toast.warning("El medio se guardó, pero la imagen anterior quedó pendiente de limpieza.");
    },
  });
}
