"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

import { DASHBOARD_NAV, DASHBOARD_NAV_FOOTER } from "@/entities/user";
import { Avatar, AvatarFallback } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

import type { IDashboardSidebarRailProps } from "./DashboardSidebarRail.types";

const BAR_HEIGHTS = ["h-2", "h-3.5", "h-2.5", "h-4"];

export default function DashboardSidebarRail({ role, session, onExpand }: IDashboardSidebarRailProps) {
  const pathname = usePathname();
  const groups = DASHBOARD_NAV[role];
  const footerLinks = DASHBOARD_NAV_FOOTER[role];
  const label = session.displayName || session.email || "Usuario";
  const initials = label.slice(0, 2).toUpperCase() || "?";

  const isGroupActive = (hrefs: string[]) =>
    hrefs.some((href) => pathname === href || pathname.startsWith(`${href}/`));

  return (
    <div className="flex h-full w-18 flex-col items-center bg-sidebar py-5 text-sidebar-foreground">
      <button
        type="button"
        onClick={onExpand}
        aria-label="Expandir el menú lateral"
        className="mb-6 flex items-end gap-0.5"
      >
        {BAR_HEIGHTS.map((h, i) => (
          <span key={i} className={`w-[2.5px] rounded-[1px] bg-foreground ${h}`} />
        ))}
      </button>

      <div className="flex w-full flex-col items-center gap-1.5">
        {groups.map((group) => {
          const hrefs = group.href
            ? [group.href]
            : (group.items ?? []).map((item) => item.href);
          const active = isGroupActive(hrefs);
          const className = cn(
            "flex size-10 items-center justify-center rounded-[10px] transition-colors",
            active
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
          );

          return group.href && !group.items ? (
            <Link key={group.label} href={group.href} className={className} title={group.label}>
              <Icon icon={group.icon ?? "ph:dot"} width={17} height={17} aria-hidden="true" />
            </Link>
          ) : (
            <button
              key={group.label}
              type="button"
              onClick={onExpand}
              className={className}
              title={group.label}
            >
              <Icon icon={group.icon ?? "ph:dot"} width={17} height={17} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      {footerLinks.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={cn(
              "mb-2 flex size-10 items-center justify-center rounded-[10px] transition-colors",
              active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            <Icon icon={item.icon} width={16} height={16} aria-hidden="true" />
          </Link>
        );
      })}

      <Avatar size="sm">
        <AvatarFallback className="bg-foreground/15 text-foreground text-xs font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
