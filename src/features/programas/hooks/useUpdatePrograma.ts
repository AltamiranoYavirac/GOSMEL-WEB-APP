"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { persistCloudinaryImage } from "@/shared/api/persist-cloudinary-image";

import { updatePrograma } from "../api/updatePrograma";
import { programasQueryKeys } from "../model/query-keys";
import type { IUpdateProgramaMutationInput } from "./useUpdatePrograma.types";

export function useUpdatePrograma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ programaId, values, currentPublicId }: IUpdateProgramaMutationInput) => {
      const result = await persistCloudinaryImage({
        file: values.imagenArchivo,
        folder: "gosmel/programas",
        currentPublicId,
        removeCurrent: values.quitarImagen,
        persist: (publicId) => updatePrograma(programaId, values, publicId),
      });
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: programasQueryKeys.list() });
      if (result.cleanupError) toast.warning("El programa se guardó, pero no se pudo eliminar la imagen anterior.");
    },
  });
}
