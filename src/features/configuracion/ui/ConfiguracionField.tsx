import { Icon } from "@iconify/react";

import type { IConfiguracionFieldProps } from "./ConfiguracionField.types";

export default function ConfiguracionField({ label, icon, value }: IConfiguracionFieldProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-background p-3.5">
      <Icon icon={icon} className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <div className="mt-1 break-words text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}
