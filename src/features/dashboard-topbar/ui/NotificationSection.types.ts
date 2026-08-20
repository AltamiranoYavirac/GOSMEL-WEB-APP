import type { TNotificationTone } from "../model/topbar-constants";

export interface INotificationSectionProps {
  icon: string;
  label: string;
  count: number;
  href: string;
  tone: TNotificationTone;
  onSelect?: () => void;
}
