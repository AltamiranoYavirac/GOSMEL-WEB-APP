export interface ISocialProvider {
  id: string;
  icon: string;
  label: string;
}

export interface ISocialAuthButtonsProps {
  dividerLabel: string;
  ariaLabelPrefix: string;
  providers?: ISocialProvider[];
  layout?: "stretch" | "compact";
  iconSize?: number;
  className?: string;
  onProviderSelect?: (provider: ISocialProvider) => void;
  disabledProviders?: string[];
  isPending?: boolean;
}
