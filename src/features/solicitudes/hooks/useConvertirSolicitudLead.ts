"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { convertirSolicitudLead, type IConvertirSolicitudLeadInput } from "../api/convertirSolicitudLead";
import { solicitudesQueryKeys } from "../model/query-keys";

export function useConvertirSolicitudLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: IConvertirSolicitudLeadInput) => {
      const { data, error } = await convertirSolicitudLead(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: solicitudesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      queryClient.invalidateQueries({ queryKey: ["representantes"] });
      queryClient.invalidateQueries({ queryKey: ["catedras"] });
      toast.success("Solicitud convertida a matrícula con éxito");
    },
    onError: (error) => {
      toast.error(`Error al convertir solicitud: ${error.message}`);
    },
  });
}
