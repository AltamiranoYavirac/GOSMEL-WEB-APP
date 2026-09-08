"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/shared/lib/utils";
import DashboardNavLink from "./DashboardNavLink";
import type { IDashboardNavGroupProps } from "./DashboardNavGroup.types";

export default function DashboardNavGroup({
  group,
  isOpen,
  hasActiveChild,
  onToggle,
  onNavigate,
}: IDashboardNavGroupProps) {
  const items = group.items ?? [];

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors duration-150 select-none cursor-pointer",
          "text-[13px] font-bold",
          hasActiveChild ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {group.icon ? (
          <Icon
            icon={group.icon}
            width={16}
            height={16}
            aria-hidden="true"
            className="shrink-0"
          />
        ) : null}
        <span className="flex-1 truncate">{group.label}</span>
        <Icon
          icon="ph:caret-down"
          width={12}
          height={12}
          aria-hidden="true"
          className={cn(
            "text-muted-foreground/60 transition-transform duration-200",
            isOpen ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-1"
            : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none"
        )}
      >
        <div className="overflow-hidden">
          <div className="relative ml-5 space-y-0.5 pl-3">
            <span className="absolute left-0 top-0 bottom-2 w-px bg-border" aria-hidden="true" />
            {items.map((item) => (
              <DashboardNavLink key={item.href} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
