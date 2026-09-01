"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

import { DASHBOARD_NAV, ROLE_LABEL } from "@/entities/user";
import { ScrollArea } from "@/shared/ui";

import DashboardNavGroup from "./DashboardNavGroup";
import type { IDashboardSidebarProps } from "./DashboardSidebar.types";

export default function DashboardSidebar({ role, onNavigate }: IDashboardSidebarProps) {
  const pathname = usePathname();
  const groups = DASHBOARD_NAV[role];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of groups) {
      const isGroupActive = group.items.some((item) =>
        item.href === "/dashboard/admin" || item.href === "/dashboard/teacher" || item.href === "/dashboard/student"
          ? pathname === item.href
          : pathname.startsWith(item.href)
      );
      initial[group.label] = isGroupActive || group.label === "General";
    }
    return initial;
  });

  useEffect(() => {
    for (const group of groups) {
      const isGroupActive = group.items.some((item) =>
        item.href === "/dashboard/admin" || item.href === "/dashboard/teacher" || item.href === "/dashboard/student"
          ? pathname === item.href
          : pathname.startsWith(item.href)
      );
      if (isGroupActive) {
        setOpenGroups((prev) => (prev[group.label] ? prev : { ...prev, [group.label]: true }));
      }
    }
  }, [pathname, groups]);

  const handleToggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="relative overflow-hidden border-b border-sidebar-border px-6 py-6">
        <div className="absolute inset-x-0 top-0 h-full bg-staff-lines opacity-30" />
        <div className="relative space-y-1">
          <Link
            href="/"
            className="font-heading text-2xl font-bold tracking-tight text-foreground block hover:text-primary transition-colors"
          >
            GOSMEL
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-background border border-white/60 dark:border-white/5 px-2.5 py-0.5 shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(169,146,125,0.15)] dark:shadow-[-1px_-1px_3px_rgba(255,255,255,0.02),1px_1px_3px_rgba(0,0,0,0.4)]">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
              {ROLE_LABEL[role]}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-5">
        <nav className="space-y-3">
          {groups.map((group) => {
            const hasActiveChild = group.items.some((item) =>
              item.href === "/dashboard/admin" || item.href === "/dashboard/teacher" || item.href === "/dashboard/student"
                ? pathname === item.href
                : pathname.startsWith(item.href)
            );
            const isOpen = Boolean(openGroups[group.label]);

            return (
              <DashboardNavGroup
                key={group.label}
                group={group}
                isOpen={isOpen}
                hasActiveChild={hasActiveChild}
                onToggle={() => handleToggleGroup(group.label)}
                onNavigate={onNavigate}
              />
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-2xl border border-transparent px-3.5 py-2.5 text-xs uppercase tracking-wider font-bold text-muted-foreground transition-all hover:bg-background hover:text-foreground hover:border-white/60 dark:hover:border-white/5 hover:shadow-[-2px_-2px_6px_rgba(255,255,255,0.8),2px_2px_6px_rgba(169,146,125,0.18)] dark:hover:shadow-[-2px_-2px_6px_rgba(255,255,255,0.03),2px_2px_6px_rgba(0,0,0,0.5)]"
        >
          <Icon icon="ph:arrow-left" width={16} height={16} aria-hidden="true" />
          Volver al sitio
        </Link>
      </div>
    </div>
  );
}
