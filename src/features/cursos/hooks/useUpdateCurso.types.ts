import type { TablesUpdate } from "@/shared/api/supabase/database.types"
import type { IEditarCursoFormValues } from "../model/EditarCursoForm.config"

export interface IUpdateCursoMutationInput {
  id: string
  values?: IEditarCursoFormValues
  patch?: TablesUpdate<"cursos">
  currentPublicId?: string | null
}
