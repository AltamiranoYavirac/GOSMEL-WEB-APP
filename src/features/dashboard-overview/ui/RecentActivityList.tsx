import Link from "next/link";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle, Separator } from "@/shared/ui";

import ActivityAvatar from "./ActivityAvatar";
import ActivityBadge from "./ActivityBadge";
import type { IRecentActivityListProps } from "./RecentActivityList.types";

export default function RecentActivityList({ title, emptyText, items, viewAllHref }: IRecentActivityListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex w-full items-center justify-between gap-2">
          <CardTitle>{title}</CardTitle>
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver todas
              <Icon icon="ph:arrow-right" width={12} height={12} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-accent-muted/40"
                >
                  <ActivityAvatar initials={item.initials} tone={item.badge?.tone} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">{item.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5">
                      {item.badge ? <ActivityBadge badge={item.badge} /> : null}
                      <span className="truncate text-xs text-muted-foreground">{item.subtitle}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.meta}</span>
                </Link>
                {index < items.length - 1 ? <Separator className="my-1" /> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  );
}
