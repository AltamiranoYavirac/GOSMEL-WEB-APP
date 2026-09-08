import Link from "next/link";
import { Icon } from "@iconify/react";

import { Separator } from "@/shared/ui";
import ActivityAvatar from "./ActivityAvatar";
import ActivityBadge from "./ActivityBadge";
import type { IRecentActivityListProps } from "./RecentActivityList.types";

export default function RecentActivityList({ title, emptyText, items, viewAllHref }: IRecentActivityListProps) {
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex w-full items-center justify-between gap-2">
        <h3 className="font-heading text-[15.5px] font-bold tracking-tight text-foreground">{title}</h3>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground transition-transform hover:translate-x-0.5"
          >
            <span>Ver todas</span>
            <Icon icon="ph:arrow-right" width={12} height={12} aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      <div className="flex-1">
        {items.length > 0 ? (
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 rounded-lg px-1.5 py-2.5 transition-colors hover:bg-foreground/5"
                >
                  <ActivityAvatar initials={item.initials} tone={item.badge?.tone} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-foreground">{item.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5">
                      {item.badge ? <ActivityBadge badge={item.badge} /> : null}
                      <span className="truncate text-[11.5px] text-muted-foreground">{item.subtitle}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] font-mono font-semibold text-muted-foreground">{item.meta}</span>
                </Link>
                {index < items.length - 1 ? <Separator className="opacity-60" /> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground font-light">{emptyText}</p>
        )}
      </div>
    </div>
  );
}
