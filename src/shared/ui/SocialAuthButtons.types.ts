export interface ISocialProvider {
  id: string;
  icon: string;
  label: string;
  color?: string;
}

export interface ISocialAuthButtonsProps {
  dividerLabel: string;
  ariaLabelPrefix: string;
  providers?: ISocialProvider[];
  layout?: "stretch" | "compact" | "stacked";
  iconSize?: number;
  className?: string;
  onProviderSelect?: (provider: ISocialProvider) => void;
  disabledProviders?: string[];
  isPending?: boolean;
}
