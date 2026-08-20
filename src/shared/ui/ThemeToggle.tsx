"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";

import { Button } from "./button";
import { Skeleton } from "./skeleton";

import type { IThemeToggleProps } from "./ThemeToggle.types";

const emptySubscribe = () => () => {};

export default function ThemeToggle({ className }: IThemeToggleProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { theme, setTheme } = useTheme();

  if (!mounted) return <Skeleton className="size-9" />;

  const resolvedTheme = theme ?? "light";

  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Cambiar tema"
      variant="ghost"
      size="icon"
      className={className}
    >
      {resolvedTheme === "dark" ? (
        <Icon icon="ph:sun" width={18} height={18} aria-hidden="true" />
      ) : (
        <Icon icon="ph:moon" width={18} height={18} aria-hidden="true" />
      )}
    </Button>
  );
}
