import type { ISiteAssetFormValues } from "../model/SiteAssetForm.config"

export interface IUpdateSiteAssetInput {
  key: string
  values: ISiteAssetFormValues
  currentPublicId: string | null
}
