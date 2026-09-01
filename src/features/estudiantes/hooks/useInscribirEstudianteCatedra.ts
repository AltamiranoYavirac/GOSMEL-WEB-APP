"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { inscribirEstudianteCatedra, type IInscribirEstudianteCatedraInput } from "../api/inscribirEstudianteCatedra";
import { estudiantesQueryKeys } from "../model/query-keys";

export function useInscribirEstudianteCatedra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: IInscribirEstudianteCatedraInput) => {
      const { data, error } = await inscribirEstudianteCatedra(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: estudiantesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["catedras"] });
      queryClient.invalidateQueries({ queryKey: ["acuerdos"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      toast.success("Estudiante asignado y matriculado en el curso/cátedra con éxito");
    },
    onError: (error) => {
      toast.error(`Error al asignar estudiante a la cátedra: ${error.message}`);
    },
  });
}
