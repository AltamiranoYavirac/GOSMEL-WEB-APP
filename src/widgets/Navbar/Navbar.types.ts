import type { ISessionUser } from "@/entities/user"

export interface INavbarProps {
  session: ISessionUser | null
}

export interface INavbarMobileMenuProps {
  session: ISessionUser | null
}
