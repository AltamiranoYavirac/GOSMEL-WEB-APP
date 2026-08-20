import { activityAvatarVariants } from "./ActivityAvatar.variants";
import type { IActivityAvatarProps } from "./ActivityAvatar.types";

export default function ActivityAvatar({ initials, tone = "primary" }: IActivityAvatarProps) {
  return (
    <span aria-hidden="true" className={activityAvatarVariants({ tone })}>
      {initials}
    </span>
  );
}
