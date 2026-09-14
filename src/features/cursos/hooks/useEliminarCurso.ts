"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteCloudinaryImage } from "@/shared/api/cloudinary-client";

import { eliminarCurso } from "../api/eliminarCurso";
import { cursosQueryKeys } from "../model/query-keys";

export function useEliminarCurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cursoId: string) => {
      const { data, error } = await eliminarCurso(cursoId);
      if (error || !data) throw new Error(error ?? "No se pudo eliminar el curso.");
      const results = await Promise.all(data.publicIds.map(deleteCloudinaryImage));
      return results.some((result) => result.error);
    },
    onSuccess: (cleanupPending) => {
      queryClient.invalidateQueries({ queryKey: cursosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["catedras"] });
      if (cleanupPending) {
        toast.warning("El curso se eliminó, pero algunas imágenes quedaron pendientes de limpieza.");
      } else {
        toast.success("Curso eliminado exitosamente");
      }
    },
    onError: (error) => toast.error(error.message),
  });
}
