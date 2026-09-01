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
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between pb-2">
      <div className="max-w-2xl space-y-2">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-background border border-white/60 dark:border-white/5 px-3 py-1 shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(169,146,125,0.15)] dark:shadow-[-1px_-1px_3px_rgba(255,255,255,0.02),1px_1px_3px_rgba(0,0,0,0.4)]">
          {icon ? <Icon icon={icon} className="size-3.5 text-primary" aria-hidden="true" /> : null}
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        {description ? (
          <p className="max-w-xl text-xs sm:text-sm font-light leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {children ? <div className="flex flex-wrap items-center gap-3">{children}</div> : null}
    </div>
  );
}