"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DASHBOARD_NAV, DASHBOARD_NAV_FOOTER, ROLE_LABEL } from "@/entities/user";
import { Avatar, AvatarFallback, ScrollArea } from "@/shared/ui";

import DashboardNavGroup from "./DashboardNavGroup";
import DashboardNavLink from "./DashboardNavLink";
import type { IDashboardSidebarProps } from "./DashboardSidebar.types";

const BAR_HEIGHTS = ["h-2", "h-3.5", "h-2.5", "h-4"];

export default function DashboardSidebar({ role, session, onNavigate }: IDashboardSidebarProps) {
  const pathname = usePathname();
  const groups = DASHBOARD_NAV[role];
  const footerLinks = DASHBOARD_NAV_FOOTER[role];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const handleToggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const label = session.displayName || session.email || "Usuario";
  const initials = label.slice(0, 2).toUpperCase() || "?";

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-4">
        <Link href="/" className="flex items-end gap-0.5" aria-label="GOSMEL — inicio">
          {BAR_HEIGHTS.map((h, i) => (
            <span key={i} className={`w-[2.5px] rounded-[1px] bg-foreground ${h}`} />
          ))}
        </Link>
        <span className="font-heading text-[0.9375rem] font-bold tracking-[0.2em] text-foreground">
          GOSMEL
        </span>
      </div>

      <ScrollArea className="flex-1 px-3 py-3.5">
        <nav className="space-y-0.5">
          {groups.map((group) => {
            if (group.href && !group.items) {
              return (
                <DashboardNavLink
                  key={group.label}
                  item={{ label: group.label, href: group.href, icon: group.icon ?? "ph:dot" }}
                  onNavigate={onNavigate}
                />
              );
            }

            const items = group.items ?? [];
            const hasActiveChild = items.some((item) =>
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            );
            const isOpen = Boolean(openGroups[group.label]) || hasActiveChild;

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

      <div className="border-t border-sidebar-border p-3">
        {footerLinks.map((item) => (
          <DashboardNavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
        <div className="mt-1.5 flex items-center gap-2.5 rounded-lg bg-foreground/5 px-2.5 py-2.5">
          <Avatar size="sm">
            <AvatarFallback className="bg-foreground/15 text-foreground text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[0.8125rem] font-bold text-foreground">
              {label}
            </div>
            <div className="text-[0.6875rem] font-medium text-muted-foreground">{ROLE_LABEL[role]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
