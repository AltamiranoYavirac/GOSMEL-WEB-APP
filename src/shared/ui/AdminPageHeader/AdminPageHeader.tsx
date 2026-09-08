import { Icon } from "@iconify/react";

import type { IAdminPageHeaderProps } from "./AdminPageHeader.types";

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  icon,
  children,
}: IAdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-2 md:flex-row md:items-start md:justify-between">
      <div className="max-w-2xl space-y-1.5">
        <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {icon ? <Icon icon={icon} className="size-3.5" aria-hidden="true" /> : null}
          <span>{eyebrow}</span>
        </div>

        <h1 className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
          {title}
        </h1>

        {description ? (
          <p className="max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {children ? <div className="flex flex-wrap items-center gap-2.5">{children}</div> : null}
    </div>
  );
}
