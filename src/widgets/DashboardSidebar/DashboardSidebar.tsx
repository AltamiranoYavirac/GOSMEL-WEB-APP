"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import { DASHBOARD_NAV, ROLE_LABEL } from "@/entities/user";
import { ScrollArea } from "@/shared/ui";

import DashboardNavLink from "./DashboardNavLink";
import type { IDashboardSidebarProps } from "./DashboardSidebar.types";

export default function DashboardSidebar({ role, onNavigate }: IDashboardSidebarProps) {
  const groups = DASHBOARD_NAV[role];

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="relative overflow-hidden border-b border-sidebar-border px-6 py-7">
        <div className="absolute inset-x-0 top-0 h-full bg-staff-lines opacity-40" />
        <div className="relative">
          <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-foreground">
            GOSMEL
          </Link>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
            {ROLE_LABEL[role]}
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-5">
        <nav className="space-y-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <DashboardNavLink key={item.href} item={item} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          <Icon icon="ph:arrow-left" width={18} height={18} aria-hidden="true" />
          Volver al sitio
        </Link>
      </div>
    </div>
  );
}
