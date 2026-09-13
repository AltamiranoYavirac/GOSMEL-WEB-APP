import Link from "next/link";

import { SessionUserMenu } from "@/features/session";
import { BrandLogo } from "@/shared/ui";

import { NAV_ITEMS } from "./Navbar.constants";
import NavbarMobileMenu from "./NavbarMobileMenu";
import type { INavbarProps } from "./Navbar.types";

export default function Navbar({ session }: INavbarProps) {
  return (
    <nav className="sticky top-0 z-50 h-14 border-b border-border bg-background/75 backdrop-blur-xl md:h-[60px]">
      <div className="mx-auto flex h-full w-full max-w-[1600px] items-center justify-between px-[18px] md:px-[34px]">
        <BrandLogo />

        <div className="hidden items-center gap-[34px] text-[13px] text-foreground/80 md:flex">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          {session ? (
            <SessionUserMenu session={session} mode="public" />
          ) : (
            <Link
              href="/login"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Iniciar sesión
            </Link>
          )}
        </div>

        <NavbarMobileMenu session={session} />
      </div>
    </nav>
  );
}
