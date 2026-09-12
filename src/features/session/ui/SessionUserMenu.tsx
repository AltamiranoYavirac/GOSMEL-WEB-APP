"use client"

import Link from "next/link"
import { Icon } from "@iconify/react"

import { ROLE_LABEL, resolvePrimaryRole } from "@/entities/user"
import { initialsOf } from "@/shared/lib/formatters"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui"

import { useLogout } from "../hooks/useLogout"
import type { ISessionUserMenuProps } from "./SessionUserMenu.types"

function cloudinaryUrl(publicId: string | null): string | null {
  if (!publicId) return null
  if (publicId.startsWith("http")) return publicId
  return `https://res.cloudinary.com/dv9lm0fnm/image/upload/q_auto,f_auto,w_200/${publicId}`
}

export default function SessionUserMenu({ session, mode = "dashboard" }: ISessionUserMenuProps) {
  const logout = useLogout(mode === "public" ? "/" : "/login")
  const role = session.roles.length > 0 ? resolvePrimaryRole(session.roles) : null
  const label = session.displayName || session.email || "Sesión activa"
  const avatarUrl = cloudinaryUrl(session.avatarPublicId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Abrir menú de usuario">
          <Avatar>
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={label} /> : null}
            <AvatarFallback className="bg-primary/15 text-primary font-semibold">
              {initialsOf(label)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-foreground">{label}</span>
          {session.email && session.email !== label ? (
            <span className="truncate text-xs font-normal text-muted-foreground">{session.email}</span>
          ) : null}
          {role ? (
            <span className="text-xs font-normal text-muted-foreground">{ROLE_LABEL[role]}</span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/perfil">
            <Icon icon="ph:user-circle" width={16} height={16} aria-hidden="true" />
            Mi cuenta
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={mode === "public" ? session.homeRoute : "/"}>
            <Icon icon="ph:globe" width={16} height={16} aria-hidden="true" />
            {mode === "public" ? "Ir a mi panel" : "Ver sitio"}
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
