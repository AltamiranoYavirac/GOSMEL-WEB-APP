"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import type { IThemeToggleProps } from "./ThemeToggle.types";

export default function ThemeToggle({ className }: IThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Cambiar tema"
      className={`w-9 h-9 flex items-center justify-center rounded-lg text-cocoa dark:text-cream hover:text-ginger dark:hover:text-ginger transition-colors ${className ?? ""}`}
    >
      {theme === "dark" ? (
        <Icon icon="ph:sun" width={18} height={18} aria-hidden="true" />
      ) : (
        <Icon icon="ph:moon" width={18} height={18} aria-hidden="true" />
      )}
    </button>
  );
}
