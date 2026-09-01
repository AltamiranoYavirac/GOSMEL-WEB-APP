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
  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all duration-200 select-none cursor-pointer",
          "hover:bg-background/60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
          hasActiveChild && !isOpen && "bg-background/40"
        )}
      >
        <div className="flex items-center gap-2">
          {hasActiveChild && (
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          )}
          <span
            className={cn(
              "text-[10px] font-mono font-bold uppercase tracking-[0.25em] transition-colors",
              hasActiveChild
                ? "text-primary"
                : "text-muted-foreground/70 group-hover:text-foreground"
            )}
          >
            {group.label}
          </span>
        </div>
        <Icon
          icon="ph:caret-down"
          width={14}
          height={14}
          aria-hidden="true"
          className={cn(
            "text-muted-foreground/60 transition-transform duration-200 group-hover:text-foreground",
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
        <div className="overflow-hidden space-y-1">
          {group.items.map((item) => (
            <DashboardNavLink
              key={item.href}
              item={item}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
