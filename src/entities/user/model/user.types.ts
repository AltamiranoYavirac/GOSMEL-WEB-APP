export type TRol = "estudiante" | "representante" | "docente" | "admin"

export interface ISessionUser {
  id: string
  email: string
  displayName: string
  avatarPublicId: string | null
  roles: TRol[]
  homeRoute: string
  isActive: boolean
}
