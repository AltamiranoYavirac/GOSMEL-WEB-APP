import Link from "next/link";

import { BrandLogo, Button, ThemeToggle } from "@/shared/ui";

import { NAV_ITEMS } from "./Navbar.constants";
import NavbarMobileMenu from "./NavbarMobileMenu";

export default function Navbar() {
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
          <ThemeToggle className="rounded-full text-muted-foreground" />
          <Link
            href="/login"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Iniciar sesión
          </Link>
          <Button
            asChild
            className="h-8 rounded-full bg-foreground px-[18px] text-[13px] font-semibold text-background hover:bg-foreground/80 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80"
          >
            <Link href="/courses">Ver cursos</Link>
          </Button>
        </div>

        <NavbarMobileMenu />
      </div>
    </nav>
  );
}
