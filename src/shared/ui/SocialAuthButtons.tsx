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
  onProviderSelect,
  disabledProviders = [],
  isPending = false,
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
        {providers.map((provider) => {
          const isDisabled = isPending || disabledProviders.includes(provider.id);

          return (
            <button
              key={provider.id}
              type="button"
              aria-label={`${ariaLabelPrefix} ${provider.label}`}
              disabled={isDisabled}
              onClick={() => onProviderSelect?.(provider)}
              className={cn(
                button(),
                isDisabled && "cursor-not-allowed opacity-50"
              )}
            >
              <Icon icon={provider.icon} width={iconSize} height={iconSize} aria-hidden="true" />
              {layout === "stacked" ? <span>Continuar con {provider.label}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
