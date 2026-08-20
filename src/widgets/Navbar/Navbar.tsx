"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button, Sheet, SheetContent, SheetTitle, SheetTrigger, ThemeToggle } from "@/shared/ui";

import Logo from "./Logo";
import { NAV_ITEMS } from "./Navbar.constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="absolute bottom-0 left-0 w-full h-8 translate-y-full bg-gradient-to-b from-background/60 to-transparent pointer-events-none dark:hidden" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Logo />

          <div className="hidden md:flex items-center space-x-10">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium tracking-wide text-sm uppercase"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <Button asChild variant="outline" className="gap-2 px-5 uppercase tracking-wider text-xs font-semibold">
              <Link href="/login">
                <Icon icon="mdi:login" width={16} height={16} aria-hidden="true" />
                Iniciar Sesión
              </Link>
            </Button>

            <Button asChild size="lg" className="px-7 uppercase tracking-wider text-xs font-semibold">
              <Link href="/register">Inscríbete Ahora</Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Abrir menú"
                >
                  <Icon
                    icon={open ? "ph:x" : "ph:list"}
                    width={28}
                    height={28}
                    aria-hidden="true"
                  />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-background">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <div className="flex flex-col gap-1 mt-10">
                  {NAV_ITEMS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="block text-muted-foreground hover:text-primary py-2 uppercase tracking-wide text-sm font-medium"
                    >
                      {label}
                    </Link>
                  ))}

                  <Button
                    asChild
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="mt-4 w-full gap-2 py-3 uppercase tracking-wider text-xs font-bold"
                  >
                    <Link href="/login">
                      <Icon icon="mdi:login" width={16} height={16} aria-hidden="true" />
                      Iniciar Sesión
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    onClick={() => setOpen(false)}
                    className="mt-2 w-full uppercase tracking-wider text-xs font-bold"
                  >
                    <Link href="/register">Inscríbete Ahora</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
