import { cn } from "@/shared/lib/utils";

import { sectionHeaderVariants } from "./SectionHeader.variants";
import type { ISectionHeaderProps } from "./SectionHeader.types";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  size = "md",
  lineAccent = false,
  className,
}: ISectionHeaderProps) {
  const { wrapper, eyebrow: eyebrowCls, title: titleCls, description: descriptionCls } =
    sectionHeaderVariants({ align, size, lineAccent });

  return (
    <div className={cn(wrapper(), className)}>
      {eyebrow && (
        <div className={eyebrowCls()}>
          {lineAccent && <span className="w-8 h-px bg-primary" />}
          <span>{eyebrow}</span>
          {lineAccent && <span className="w-8 h-px bg-primary" />}
        </div>
      )}
      <h2 className={titleCls()}>{title}</h2>
      {description && <p className={descriptionCls()}>{description}</p>}
    </div>
  );
}
