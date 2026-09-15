"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteCloudinaryImage } from "@/shared/api/cloudinary-client";

import { eliminarTestimonio } from "../api/eliminarTestimonio";
import { testimoniosQueryKeys } from "../model/query-keys";

export function useEliminarTestimonio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await eliminarTestimonio(id);
      if (error || !data) throw new Error(error ?? "No se pudo eliminar el testimonio.");
      if (!data.publicId) return null;
      const cleanup = await deleteCloudinaryImage(data.publicId);
      return cleanup.error;
    },
    onSuccess: (cleanupError) => {
      queryClient.invalidateQueries({ queryKey: testimoniosQueryKeys.list() });
      if (cleanupError) {
        toast.warning("El testimonio se eliminó, pero la imagen quedó pendiente de limpieza.");
      }
    },
  });
}
