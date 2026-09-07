import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/shared/ui";

import type { IStudentStatCardProps } from "./StudentStatCard.types";

export default function StudentStatCard({ icon, label, value, helper }: IStudentStatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
          <Icon icon={icon} className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="truncate font-heading text-xl font-semibold text-foreground">{value}</p>
          {helper ? <p className="truncate text-xs text-muted-foreground">{helper}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}