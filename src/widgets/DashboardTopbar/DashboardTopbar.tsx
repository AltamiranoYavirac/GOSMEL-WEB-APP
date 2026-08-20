"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

import { DASHBOARD_NAV, getDashboardSectionLabel } from "@/entities/user";
import { SessionUserMenu } from "@/features/session";
import { Button, ThemeToggle } from "@/shared/ui";

import type { IDashboardTopbarProps } from "./DashboardTopbar.types";

export default function DashboardTopbar({ role, onMenuClick }: IDashboardTopbarProps) {
  const pathname = usePathname();
  const sectionLabel = getDashboardSectionLabel(pathname, DASHBOARD_NAV[role]);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon-lg"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <Icon icon="ph:list" width={22} height={22} aria-hidden="true" />
      </Button>

      <h1 className="flex-1 truncate font-heading text-lg font-semibold text-foreground">
        {sectionLabel}
      </h1>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <SessionUserMenu />
      </div>
    </header>
  );
}
