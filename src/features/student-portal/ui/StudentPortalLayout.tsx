"use client";

import StudentPortalContent from "./StudentPortalContent";
import type { IStudentPortalLayoutProps } from "./StudentPortalLayout.types";
import StudentPortalProvider from "./StudentPortalProvider";

export default function StudentPortalLayout({ children }: IStudentPortalLayoutProps) {
  return (
    <StudentPortalProvider>
      <StudentPortalContent>{children}</StudentPortalContent>
    </StudentPortalProvider>
  );
}
