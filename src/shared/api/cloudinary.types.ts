export type TCloudinaryImageBaseFolder =
  | "gosmel/cursos"
  | "gosmel/programas"
  | "gosmel/galeria"
  | "gosmel/sitio"
  | "gosmel/secciones"
  | "gosmel/testimonios"

export type TCloudinaryImageFolder =
  | TCloudinaryImageBaseFolder
  | `${TCloudinaryImageBaseFolder}/${string}`

export interface ICloudinaryImageMeta {
  displayName?: string
  tags?: string[]
}
