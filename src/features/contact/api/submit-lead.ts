import type {
  IApiResult,
  IContactLead,
  TContactLeadValues,
} from "../model/contact.types";

export async function submitLead(
  values: TContactLeadValues,
): Promise<IApiResult<IContactLead>> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    data: { id: crypto.randomUUID(), email: values.email },
    error: null,
  };
}
