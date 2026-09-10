"use client"

import Link from "next/link"
import { Icon } from "@iconify/react"

import { ROLE_LABEL, resolvePrimaryRole, resolveProfileRoute } from "@/entities/user"
import { initialsOf } from "@/shared/lib/formatters"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
  const firstName = label.split(" ")[0]
  const avatarUrl = cloudinaryUrl(session.avatarPublicId)
  const profileRoute = resolveProfileRoute(session.roles)
  const panelHref = mode === "public" ? session.homeRoute : "/"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2 rounded-full px-1 sm:pr-3"
          aria-label="Abrir menú de usuario"
        >
          <Avatar className="ring-2 ring-primary/15">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={label} /> : null}
            <AvatarFallback className="bg-primary/15 font-semibold text-primary-700">
              {initialsOf(label)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[128px] truncate text-sm font-medium sm:block">
            {firstName}
          </span>
          <Icon
            icon="ph:caret-down"
            width={14}
            height={14}
            aria-hidden="true"
            className="hidden shrink-0 text-muted-foreground transition-transform group-aria-expanded/button:rotate-180 sm:block"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[300px] overflow-hidden p-0">
        <div className="flex items-center gap-3 bg-gradient-to-br from-primary/12 via-accent-500/8 to-transparent px-4 pt-4 pb-3">
          <Avatar size="lg" className="shadow-sm ring-2 ring-background">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={label} /> : null}
            <AvatarFallback className="bg-primary/15 font-semibold text-primary-700">
              {initialsOf(label)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{label}</p>
            {session.email && session.email !== label ? (
              <p className="truncate text-xs text-muted-foreground">{session.email}</p>
            ) : null}
          </div>
        </div>

        {role ? (
          <div className="px-4 pb-3">
            <Badge variant="secondary" className="gap-1">
              <Icon icon="ph:identification-badge" width={12} height={12} aria-hidden="true" />
              {ROLE_LABEL[role]}
            </Badge>
          </div>
        ) : null}

        <DropdownMenuSeparator className="my-0" />

        <DropdownMenuGroup className="p-1.5">
          <DropdownMenuLabel className="px-2 text-[10px] uppercase tracking-wider">
            Cuenta
          </DropdownMenuLabel>
          {profileRoute ? (
            <DropdownMenuItem asChild className="gap-3 px-2 py-2">
              <Link href={profileRoute}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-700">
                  <Icon icon="ph:user-circle" width={17} height={17} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium">Perfil</span>
                  <span className="text-xs text-muted-foreground">Tus datos y preferencias</span>
                </span>
              </Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem asChild className="gap-3 px-2 py-2">
            <Link href={panelHref}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-700">
                <Icon
                  icon={mode === "public" ? "ph:squares-four" : "ph:globe"}
                  width={17}
                  height={17}
                  aria-hidden="true"
                />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium">
                  {mode === "public" ? "Ir a mi panel" : "Ver sitio"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {mode === "public" ? "Tu espacio de trabajo" : "Volver al sitio público"}
                </span>
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-0" />

        <div className="p-1.5">
          <DropdownMenuItem
            variant="destructive"
            className="gap-3 px-2 py-2"
            disabled={logout.isPending}
            onClick={() => logout.mutate()}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <Icon icon="ph:sign-out" width={17} height={17} aria-hidden="true" />
            </span>
            <span className="text-sm font-medium">
              {logout.isPending ? "Cerrando sesión…" : "Cerrar sesión"}
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
