"use client"

import Link from "next/link"
import { Icon } from "@iconify/react"

import { ROLE_LABEL, resolvePrimaryRole } from "@/entities/user"
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from "@/shared/ui"

import { useSession } from "../hooks/useSession"
import { useLogout } from "../hooks/useLogout"

export default function SessionUserMenu() {
  const session = useSession()
  const logout = useLogout()

  if (session.isPending) {
    return <Skeleton className="size-9 rounded-full" />
  }

  const email = session.data?.email ?? ""
  const initials = email.slice(0, 2).toUpperCase() || "?"
  const role = session.data ? resolvePrimaryRole(session.data.roles) : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarFallback className="bg-primary/15 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-foreground">{email || "Sesión activa"}</span>
          {role ? (
            <span className="text-xs font-normal text-muted-foreground">{ROLE_LABEL[role]}</span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">
            <Icon icon="ph:globe" width={16} height={16} aria-hidden="true" />
            Ver sitio
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          <Icon icon="ph:sign-out" width={16} height={16} aria-hidden="true" />
          {logout.isPending ? "Cerrando sesión…" : "Cerrar sesión"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
