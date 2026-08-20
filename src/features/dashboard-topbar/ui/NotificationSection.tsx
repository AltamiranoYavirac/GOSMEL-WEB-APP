import Link from "next/link";
import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";
import { DropdownMenuItem } from "@/shared/ui";

import { SECTION_TONE } from "../model/topbar-constants";
import type { INotificationSectionProps } from "./NotificationSection.types";

export default function NotificationSection({ icon, label, count, href, tone, onSelect }: INotificationSectionProps) {
  return (
    <DropdownMenuItem asChild onSelect={onSelect} className="p-0 focus:bg-transparent">
      <Link href={href} className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5">
        <Icon icon={icon} width={18} height={18} className={cn("shrink-0", SECTION_TONE[tone])} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-sm text-foreground">{label}</span>
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
          {count}
        </span>
      </Link>
    </DropdownMenuItem>
  );
}
