"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteCloudinaryImage } from "@/shared/api/cloudinary-client";

import { eliminarPrograma } from "../api/eliminarPrograma";
import { programasQueryKeys } from "../model/query-keys";

export function useEliminarPrograma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programaId: string) => {
      const { data, error } = await eliminarPrograma(programaId);
      if (error || !data) throw new Error(error ?? "No se pudo eliminar el programa.");
      if (data.publicId) {
        const cleanup = await deleteCloudinaryImage(data.publicId);
        return cleanup.error;
      }
      return null;
    },
    onSuccess: (cleanupError) => {
      queryClient.invalidateQueries({ queryKey: programasQueryKeys.list() });
      if (cleanupError) toast.warning("El programa se eliminó, pero la imagen quedó pendiente de limpieza.");
    },
  });
}
