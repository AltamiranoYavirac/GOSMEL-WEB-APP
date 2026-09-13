"use client";

import { useState } from "react";
import Link from "next/link";

import { useLogout } from "@/features/session";
import { initialsOf } from "@/shared/lib/formatters";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  BrandLogo,
  Button,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui";

import { NAV_ITEMS } from "./Navbar.constants";
import type { INavbarMobileMenuProps } from "./Navbar.types";

function cloudinaryUrl(publicId: string | null): string | null {
  if (!publicId) return null;
  if (publicId.startsWith("http")) return publicId;
  return `https://res.cloudinary.com/dv9lm0fnm/image/upload/q_auto,f_auto,w_200/${publicId}`;
}

export default function NavbarMobileMenu({ session }: INavbarMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const logout = useLogout("/");
  const label = session?.displayName || session?.email || "Usuario";
  const avatarUrl = session ? cloudinaryUrl(session.avatarPublicId) : null;

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: close });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Abrir menú"
          className="size-11 rounded-none hover:bg-transparent md:hidden"
        >
          <span className="flex flex-col items-end gap-[5px]" aria-hidden="true">
            <span className="h-px w-5 bg-current" />
            <span className="h-px w-5 bg-current" />
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[82vw] max-w-xs border-border bg-background p-0">
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
        <div className="border-b border-border px-6 py-5">
          <BrandLogo />
        </div>
        <div className="flex flex-1 flex-col px-6 py-8">
          <nav aria-label="Navegación móvil" className="flex flex-col">
            {NAV_ITEMS.map(({ href, label: itemLabel }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="border-b border-border py-4 text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                {itemLabel}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-3 pt-8">
            {session ? (
              <div className="space-y-3 rounded-xl border border-border p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar>
                    {avatarUrl ? <AvatarImage src={avatarUrl} alt={label} /> : null}
                    <AvatarFallback>{initialsOf(label)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{label}</p>
                    <p className="truncate text-xs text-muted-foreground">{session.email}</p>
                  </div>
                </div>
                <Button asChild className="h-11 w-full rounded-full">
                  <Link href={session.homeRoute} onClick={close}>Ir a mi panel</Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full rounded-full"
                  disabled={logout.isPending}
                  onClick={handleLogout}
                >
                  {logout.isPending ? "Cerrando sesión…" : "Cerrar sesión"}
                </Button>
              </div>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full rounded-full border-border bg-transparent"
                  onClick={close}
                >
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Link
                  href="/register"
                  onClick={close}
                  className="block py-2 text-center text-sm font-medium text-primary"
                >
                  Inscríbete ahora
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
