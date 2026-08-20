"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

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
      {item.label}
    </Link>
  );
}
