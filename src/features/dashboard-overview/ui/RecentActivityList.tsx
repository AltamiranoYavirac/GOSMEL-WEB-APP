import Link from "next/link";
import { Icon } from "@iconify/react";

import { Separator } from "@/shared/ui";
import ActivityAvatar from "./ActivityAvatar";
import ActivityBadge from "./ActivityBadge";
import type { IRecentActivityListProps } from "./RecentActivityList.types";

export default function RecentActivityList({ title, emptyText, items, viewAllHref }: IRecentActivityListProps) {
  return (
    <div className="h-full rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] p-6 sm:p-7 flex flex-col justify-between gap-4">
      <div className="flex w-full items-center justify-between gap-2">
        <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">{title}</h3>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider font-bold text-primary transition-transform hover:translate-x-0.5"
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
                  className="flex items-center gap-3 rounded-2xl px-2.5 py-2.5 transition-all hover:bg-background hover:shadow-[-2px_-2px_6px_rgba(255,255,255,0.8),2px_2px_6px_rgba(169,146,125,0.18)] dark:hover:shadow-[-2px_-2px_6px_rgba(255,255,255,0.03),2px_2px_6px_rgba(0,0,0,0.5)] group"
                >
                  <ActivityAvatar initials={item.initials} tone={item.badge?.tone} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5">
                      {item.badge ? <ActivityBadge badge={item.badge} /> : null}
                      <span className="truncate text-xs text-muted-foreground font-light">{item.subtitle}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] font-mono font-semibold text-muted-foreground">{item.meta}</span>
                </Link>
                {index < items.length - 1 ? <Separator className="my-1 opacity-50" /> : null}
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
