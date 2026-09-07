"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useStudentPortal } from "../hooks/useStudentPortal";
import StudentHeaderSwitcher from "./StudentHeaderSwitcher";
import StudentPortalProvider from "./StudentPortalProvider";

function StudentPortalContent({ children }: { children: ReactNode }) {
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

export default function StudentPortalLayout({ children }: { children: ReactNode }) {
  return (
    <StudentPortalProvider>
      <StudentPortalContent>{children}</StudentPortalContent>
    </StudentPortalProvider>
  );
}