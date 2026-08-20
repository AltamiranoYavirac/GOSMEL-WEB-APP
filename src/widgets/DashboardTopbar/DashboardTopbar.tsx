"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { DASHBOARD_NAV, getDashboardSectionGroup, getDashboardSectionLabel } from "@/entities/user";
import { GlobalSearchDialog, NotificationsMenu, QuickActionsMenu, TodayChip } from "@/features/dashboard-topbar";
import { SessionUserMenu } from "@/features/session";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ThemeToggle,
} from "@/shared/ui";

import type { IDashboardTopbarProps } from "./DashboardTopbar.types";

export default function DashboardTopbar({ role, onMenuClick }: IDashboardTopbarProps) {
  const pathname = usePathname();
  const groups = DASHBOARD_NAV[role];
  const sectionLabel = getDashboardSectionLabel(pathname, groups);
  const groupLabel = getDashboardSectionGroup(pathname, groups);
  const isAdmin = role === "admin";

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

      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="flex-nowrap">
          {groupLabel ? (
            <>
              <BreadcrumbItem className="hidden md:inline-flex">
                <BreadcrumbLink asChild>
                  <Link href={`/dashboard/${role}`}>{groupLabel}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:inline-flex" />
            </>
          ) : null}
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate font-heading text-base font-semibold">
              {sectionLabel}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-1.5">
        {isAdmin ? <TodayChip /> : null}
        {isAdmin ? <GlobalSearchDialog /> : null}
        {isAdmin ? <QuickActionsMenu /> : null}
        {isAdmin ? <NotificationsMenu /> : null}
        <ThemeToggle />
        <SessionUserMenu />
      </div>
    </header>
  );
}
