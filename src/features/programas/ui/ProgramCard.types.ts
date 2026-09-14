import type { IPublicProgram } from "../model/program-public.types"

export interface IProgramCardProps {
  program: IPublicProgram
  number: string
  total: string
  isFirst: boolean
  isLast: boolean
}
