"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteCloudinaryImage } from "@/shared/api/cloudinary-client";

import { eliminarSeccion } from "../api/eliminarSeccion";
import { seccionesQueryKeys } from "../model/query-keys";

export function useEliminarSeccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await eliminarSeccion(id);
      if (error || !data) throw new Error(error ?? "No se pudo eliminar la sección.");
      if (!data.publicId) return null;
      const cleanup = await deleteCloudinaryImage(data.publicId);
      return cleanup.error;
    },
    onSuccess: (cleanupError) => {
      queryClient.invalidateQueries({ queryKey: seccionesQueryKeys.list() });
      if (cleanupError) {
        toast.warning("La sección se eliminó, pero la imagen quedó pendiente de limpieza.");
      }
    },
  });
}
