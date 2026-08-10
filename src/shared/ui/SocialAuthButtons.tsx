import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";
import { SOCIAL_PROVIDERS } from "@/shared/config/social";

import { socialAuthButtonsVariants } from "./SocialAuthButtons.variants";
import type { ISocialAuthButtonsProps } from "./SocialAuthButtons.types";

export default function SocialAuthButtons({
  dividerLabel,
  ariaLabelPrefix,
  providers = SOCIAL_PROVIDERS,
  layout = "stretch",
  iconSize = 22,
  className,
}: ISocialAuthButtonsProps) {
  const { root, divider, dividerLine, dividerLabel: dividerLabelCls, buttons, button } =
    socialAuthButtonsVariants({ layout });

  return (
    <div className={cn(root(), className)}>
      <div className={divider()}>
        <span className={dividerLine()} />
        <span className={dividerLabelCls()}>{dividerLabel}</span>
        <span className={dividerLine()} />
      </div>

      <div className={buttons()}>
        {providers.map(({ id, icon, label }) => (
          <button
            key={id}
            type="button"
            aria-label={`${ariaLabelPrefix} ${label}`}
            className={button()}
          >
            <Icon icon={icon} width={iconSize} height={iconSize} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
