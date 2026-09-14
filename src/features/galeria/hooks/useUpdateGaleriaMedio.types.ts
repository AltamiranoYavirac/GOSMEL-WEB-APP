import type { IGaleriaFormValues } from "../model/GaleriaForm.config"

export interface IUpdateGaleriaMedioInput {
  id: string
  values: IGaleriaFormValues
  currentPublicId: string
}
