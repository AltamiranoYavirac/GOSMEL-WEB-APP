"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";

import { dashboardNavLinkVariants, dashboardNavIconVariants } from "./DashboardNavLink.variants";
import type { IDashboardNavLinkProps } from "./DashboardNavLink.types";

export default function DashboardNavLink({ item, onNavigate }: IDashboardNavLinkProps) {
  const pathname = usePathname();
  const isDashboardRoot = item.href === "/dashboard/admin" || item.href === "/dashboard/teacher" || item.href === "/dashboard/student";
  const isActive = isDashboardRoot ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={dashboardNavLinkVariants({ active: isActive, className: "group" })}
    >
      <Icon
        icon={item.icon}
        width={18}
        height={18}
        aria-hidden="true"
        className={dashboardNavIconVariants({ active: isActive })}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined ? (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums",
            isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
