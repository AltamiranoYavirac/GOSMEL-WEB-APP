"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { persistCloudinaryImage } from "@/shared/api/persist-cloudinary-image";

import { crearTestimonio } from "../api/crearTestimonio";
import type { ITestimonioFormValues } from "../model/TestimonioForm.config";
import { testimoniosQueryKeys } from "../model/query-keys";

export function useCrearTestimonio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ITestimonioFormValues) => {
      const result = await persistCloudinaryImage({
        file: values.file,
        folder: "gosmel/testimonios",
        meta: { displayName: `Testimonio - ${values.autor}`, tags: ["testimonio:foto"] },
        persist: (publicId) => crearTestimonio(values, publicId),
      });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testimoniosQueryKeys.list() }),
  });
}
