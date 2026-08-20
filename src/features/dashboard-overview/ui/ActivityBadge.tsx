import { activityBadgeVariants } from "./ActivityBadge.variants";
import type { IActivityBadgeProps } from "./ActivityBadge.types";

export default function ActivityBadge({ badge }: IActivityBadgeProps) {
  return <span className={activityBadgeVariants({ tone: badge.tone })}>{badge.label}</span>;
}
