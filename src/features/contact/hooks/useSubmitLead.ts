import { useMutation } from "@tanstack/react-query";

import { submitLead } from "../api/submit-lead";
import type { TContactLeadValues } from "../model/contact.types";

export function useSubmitLead() {
  return useMutation({
    mutationFn: async (values: TContactLeadValues) => {
      const { data, error } = await submitLead(values);
      if (error) throw new Error(error);
      return data;
    },
  });
}
