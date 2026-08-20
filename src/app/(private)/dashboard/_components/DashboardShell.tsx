"use client";

import { useState } from "react";

import { DashboardSidebar } from "@/widgets/DashboardSidebar";
import { DashboardTopbar } from "@/widgets/DashboardTopbar";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui";

import type { IDashboardShellProps } from "./DashboardShell.types";

export default function DashboardShell({ role, children }: IDashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border lg:block">
        <DashboardSidebar role={role} />
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Menú del panel</SheetTitle>
          <DashboardSidebar role={role} onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar role={role} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
