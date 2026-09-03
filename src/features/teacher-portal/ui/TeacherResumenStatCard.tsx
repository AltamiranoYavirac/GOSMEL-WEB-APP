"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/shared/ui";
import type { ITeacherResumenStatCardProps } from "./TeacherResumenStatCard.types";

export default function TeacherResumenStatCard({
  icon,
  label,
  value,
  description,
}: ITeacherResumenStatCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/60 transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary shadow-xs">
          <Icon icon={icon} className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {description ? (
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
