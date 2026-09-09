import { Icon } from "@iconify/react";

import type { IStudentRatingStarsProps } from "./StudentRatingStars.types";

export default function StudentRatingStars({ value }: IStudentRatingStarsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon={star <= value ? "ph:star-fill" : "ph:star"}
          className={star <= value ? "size-4 text-primary" : "size-4 text-muted-foreground/50"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
