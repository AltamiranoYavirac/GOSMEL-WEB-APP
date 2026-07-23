import type { z } from "zod";
import type { contactLeadSchema } from "./schemas";

export type TContactLeadValues = z.infer<typeof contactLeadSchema>;

export interface IContactLead {
  id: string;
  email: string;
}

export interface IApiResult<T> {
  data: T | null;
  error: string | null;
}
