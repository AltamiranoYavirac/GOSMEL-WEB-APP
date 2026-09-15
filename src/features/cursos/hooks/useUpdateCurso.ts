"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { persistCloudinaryImage } from "@/shared/api/persist-cloudinary-image";

import { updateCurso } from "../api/updateCurso";
import { buildEditarCursoPayload } from "../model/EditarCursoForm.config";
import { cursosQueryKeys } from "../model/query-keys";
import type { IUpdateCursoMutationInput } from "./useUpdateCurso.types";

export function useUpdateCurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values, patch, currentPublicId }: IUpdateCursoMutationInput) => {
      if (!values) {
        const result = await updateCurso(id, patch ?? {});
        if (result.error) throw new Error(result.error);
        return { ...result, cleanupError: null };
      }

      const result = await persistCloudinaryImage({
        file: values.portadaArchivo,
        folder: "gosmel/cursos",
        currentPublicId,
        removeCurrent: values.quitarPortada,
        meta: { displayName: `Portada - ${values.nombre}`, tags: [`curso:${id}`] },
        persist: (publicId) => updateCurso(id, buildEditarCursoPayload(values, publicId)),
      });
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: cursosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: cursosQueryKeys.detail(variables.id) });
      if (result.cleanupError) {
        toast.warning("El curso se actualizó, pero no se pudo eliminar la imagen anterior.");
      } else {
        toast.success("Curso actualizado correctamente");
      }
    },
    onError: (error) => toast.error(error.message),
  });
}
