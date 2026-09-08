import type { ISessionUser } from "@/entities/user"

export interface ISessionUserMenuProps {
  session: ISessionUser
  mode?: "dashboard" | "public"
}
