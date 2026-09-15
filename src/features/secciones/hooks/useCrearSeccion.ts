"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { persistCloudinaryImage } from "@/shared/api/persist-cloudinary-image";

import { crearSeccion } from "../api/crearSeccion";
import type { ISeccionFormValues } from "../model/SeccionForm.config";
import { seccionesQueryKeys } from "../model/query-keys";

export function useCrearSeccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ISeccionFormValues) => {
      const result = await persistCloudinaryImage({
        file: values.file,
        folder: "gosmel/secciones",
        meta: { displayName: `Sección - ${values.titulo}`, tags: [`seccion:${values.clave}`] },
        persist: (publicId) => crearSeccion(values, publicId),
      });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: seccionesQueryKeys.list() }),
  });
}
