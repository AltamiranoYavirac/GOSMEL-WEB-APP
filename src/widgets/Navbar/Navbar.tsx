"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/courses", label: "Cursos" },
  { href: "/about", label: "Nosotros" },
  { href: "/contact", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-cream/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-peach/40 dark:border-neutral-700/40 shadow-sm shadow-neutral-200/50 dark:shadow-neutral-900/50">
      <div className="absolute bottom-0 left-0 w-full h-8 translate-y-full bg-gradient-to-b from-cream/60 to-transparent pointer-events-none dark:hidden" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Logo />

          <div className="hidden md:flex items-center space-x-10">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-cocoa/80 dark:text-cream/80 hover:text-ginger dark:hover:text-ginger transition-colors font-medium tracking-wide text-sm uppercase"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact"
              className="bg-ginger hover:bg-burnt text-cream px-7 py-2.5 font-semibold transition-all uppercase tracking-wider text-xs rounded-lg"
            >
              Inscríbete Ahora
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="text-cocoa dark:text-cream hover:text-ginger"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-cream dark:bg-neutral-900 border-t border-peach/30 dark:border-neutral-700/30 px-4 pb-6 pt-4 space-y-4">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block text-cocoa/80 dark:text-cream/80 hover:text-ginger py-2 uppercase tracking-wide text-sm font-medium"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block bg-ginger hover:bg-burnt text-cream text-center py-3 font-bold uppercase tracking-wider text-xs mt-4 rounded-lg transition-colors"
          >
            Inscríbete Ahora
          </Link>
        </div>
      )}
    </nav>
  );
}
