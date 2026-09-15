"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { persistCloudinaryImage } from "@/shared/api/persist-cloudinary-image";
import { buildCloudinaryFolder } from "@/shared/config";

import { actualizarSeccion } from "../api/actualizarSeccion";
import type { ISeccionFormValues } from "../model/SeccionForm.config";
import { seccionesQueryKeys } from "../model/query-keys";

export function useActualizarSeccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
      currentPublicId,
    }: {
      id: string;
      values: ISeccionFormValues;
      currentPublicId: string | null;
    }) => {
      const result = await persistCloudinaryImage({
        file: values.file,
        folder: buildCloudinaryFolder("gosmel/secciones", id),
        currentPublicId,
        removeCurrent: values.removeImage,
        meta: { displayName: `Sección - ${values.titulo}`, tags: [`seccion:${id}`] },
        persist: (publicId) => actualizarSeccion(id, values, publicId),
      });
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: seccionesQueryKeys.list() });
      if (result.cleanupError) {
        toast.warning("La sección se guardó, pero la imagen anterior quedó pendiente de limpieza.");
      }
    },
  });
}
