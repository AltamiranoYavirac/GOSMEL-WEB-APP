"use client";

import { useState } from "react";

import { DashboardSidebar, DashboardSidebarRail } from "@/widgets/DashboardSidebar";
import { DashboardTopbar } from "@/widgets/DashboardTopbar";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui";

import type { IDashboardShellProps } from "./DashboardShell.types";

const COLLAPSE_KEY = "gosmel:dashboard-sidebar-collapsed";

export default function DashboardShell({ role, session, children }: IDashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return typeof window !== "undefined" && localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const handleToggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* localStorage no disponible */
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={`hidden shrink-0 border-r border-sidebar-border lg:block ${
          collapsed ? "w-[72px]" : "w-[264px]"
        }`}
      >
        {collapsed ? (
          <DashboardSidebarRail role={role} session={session} onExpand={handleToggleCollapsed} />
        ) : (
          <DashboardSidebar role={role} session={session} />
        )}
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-[290px] p-0">
          <SheetTitle className="sr-only">Menú del panel</SheetTitle>
          <DashboardSidebar role={role} session={session} onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          role={role}
          session={session}
          onMenuClick={() => setMobileNavOpen(true)}
          onToggleSidebar={handleToggleCollapsed}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
