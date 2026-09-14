"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteCloudinaryImage } from "@/shared/api/cloudinary-client";

import { eliminarGaleriaMedio } from "../api/eliminarGaleriaMedio";
import { galeriaQueryKeys } from "../model/query-keys";

export function useEliminarGaleriaMedio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await eliminarGaleriaMedio(id);
      if (error || !data) throw new Error(error ?? "No se pudo eliminar el medio.");
      const cleanup = await deleteCloudinaryImage(data.publicId);
      return cleanup.error;
    },
    onSuccess: (cleanupError) => {
      queryClient.invalidateQueries({ queryKey: galeriaQueryKeys.list() });
      if (cleanupError) toast.warning("El medio se eliminó, pero la imagen quedó pendiente de limpieza.");
    },
  });
}
