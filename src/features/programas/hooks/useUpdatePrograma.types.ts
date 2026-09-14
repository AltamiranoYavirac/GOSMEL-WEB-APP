import type { IProgramaFormValues } from "../model/ProgramaForm.config"

export interface IUpdateProgramaMutationInput {
  programaId: string
  values: IProgramaFormValues
  currentPublicId?: string | null
}
