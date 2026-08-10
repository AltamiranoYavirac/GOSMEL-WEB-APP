import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";

import { iconTileVariants } from "./IconTile.variants";
import type { IIconTileProps } from "./IconTile.types";

export default function IconTile({
  icon,
  size = "md",
  iconSize = 22,
  iconClassName,
  className,
}: IIconTileProps) {
  return (
    <div className={cn(iconTileVariants({ size }), className)}>
      <Icon icon={icon} width={iconSize} height={iconSize} className={iconClassName} aria-hidden="true" />
    </div>
  );
}
