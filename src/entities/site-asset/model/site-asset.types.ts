export interface ISiteAsset {
  key: string
  name: string
  publicId: string
  alt: string
  order: number
}

export type TSiteAssetMap = Record<string, ISiteAsset>
