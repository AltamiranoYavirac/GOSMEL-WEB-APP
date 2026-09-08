import { cn } from "@/shared/lib/utils";

import type { IDataLabelProps } from "./DataLabel.types";

export default function DataLabel({ children, className }: IDataLabelProps) {
  return (
    <div
      className={cn(
        "text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}
