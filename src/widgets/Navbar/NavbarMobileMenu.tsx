"use client";

import { useState } from "react";
import Link from "next/link";

import {
  BrandLogo,
  Button,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  ThemeToggle,
} from "@/shared/ui";

import { NAV_ITEMS } from "./Navbar.constants";

export default function NavbarMobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Abrir menú"
          className="size-11 rounded-none hover:bg-transparent dark:hover:bg-transparent md:hidden"
        >
          <span className="flex flex-col items-end gap-[5px]" aria-hidden="true">
            <span className="h-px w-5 bg-current" />
            <span className="h-px w-5 bg-current" />
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[82vw] max-w-xs border-border bg-background p-0"
      >
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
        <div className="border-b border-border px-6 py-5">
          <BrandLogo />
        </div>
        <div className="flex flex-1 flex-col px-6 py-8">
          <nav aria-label="Navegación móvil" className="flex flex-col">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-3 pt-8">
            <div className="flex items-center justify-between border-y border-border py-3 text-sm text-muted-foreground">
              <span>Tema</span>
              <ThemeToggle className="rounded-full" />
            </div>
            <Button
              asChild
              variant="outline"
              className="h-12 w-full rounded-full border-border bg-transparent"
              onClick={() => setOpen(false)}
            >
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button
              asChild
              className="h-12 w-full rounded-full bg-foreground text-background hover:bg-foreground/80 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80"
              onClick={() => setOpen(false)}
            >
              <Link href="/courses">Ver cursos</Link>
            </Button>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="block py-2 text-center text-sm font-medium text-primary"
            >
              Inscríbete ahora
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
