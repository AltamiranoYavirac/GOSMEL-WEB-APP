"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useStudentPortal } from "../hooks/useStudentPortal";
import StudentHeaderSwitcher from "./StudentHeaderSwitcher";
import type { IStudentPortalContentProps } from "./StudentPortalContent.types";

export default function StudentPortalContent({ children }: IStudentPortalContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isRegisteredOnly } = useStudentPortal();

  useEffect(() => {
    if (isRegisteredOnly && pathname !== "/dashboard/student") {
      router.replace("/dashboard/student");
    }
  }, [isRegisteredOnly, pathname, router]);

  return (
    <div className="space-y-6">
      <StudentHeaderSwitcher />
      {children}
    </div>
  );
}
