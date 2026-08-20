import { Icon } from "@iconify/react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

import { activityIcon } from "../model/topbar-constants";
import type { IActivityRowProps } from "./ActivityRow.types";

function relativeTime(iso: string) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: es });
  } catch {
    return "";
  }
}

export default function ActivityRow({ activity }: IActivityRowProps) {
  return (
    <li>
      <div className="flex items-start gap-3 px-2 py-2">
        <span aria-hidden="true" className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-700 dark:text-primary-300">
          <Icon icon={activityIcon(activity.tipo)} width={14} height={14} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">{activity.titulo}</span>
          {activity.descripcion ? (
            <span className="block truncate text-xs text-muted-foreground">{activity.descripcion}</span>
          ) : null}
          <span className="block text-[11px] text-muted-foreground/80">{relativeTime(activity.created_at)}</span>
        </span>
      </div>
    </li>
  );
}
