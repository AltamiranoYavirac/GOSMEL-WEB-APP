"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { persistCloudinaryImage } from "@/shared/api/persist-cloudinary-image";

import { updateTestimonio } from "../api/updateTestimonio";
import { testimoniosQueryKeys } from "../model/query-keys";
import type { IUpdateTestimonioInput } from "./useUpdateTestimonio.types";

export function useUpdateTestimonio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values, currentPublicId }: IUpdateTestimonioInput) => {
      const result = await persistCloudinaryImage({
        file: values.file,
        folder: "gosmel/testimonios",
        currentPublicId,
        removeCurrent: values.removeImage,
        meta: { displayName: `Testimonio - ${values.autor}`, tags: [`testimonio:${id}`] },
        persist: (publicId) => updateTestimonio(id, values, publicId),
      });
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: testimoniosQueryKeys.list() });
      if (result.cleanupError) {
        toast.warning("El testimonio se guardó, pero la imagen anterior quedó pendiente de limpieza.");
      }
    },
  });
}
