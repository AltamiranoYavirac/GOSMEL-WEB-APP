import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { formatDateTime } from "@/shared/lib/formatters";

import type { IStudentActivityFeedProps } from "./StudentActivityFeed.types";

export default function StudentActivityFeed({ items }: IStudentActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad reciente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay actividad registrada.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <Icon icon="ph:bell" className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{item.titulo}</p>
                {item.descripcion ? <p className="text-xs text-muted-foreground">{item.descripcion}</p> : null}
                <p className="text-xs text-muted-foreground/70">{formatDateTime(item.creadaEn)}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}