export type TRol = "estudiante" | "representante" | "docente" | "admin"

export interface ISessionUser {
  id: string
  email: string
  roles: TRol[]
}
