import { Suspense } from "react";

import { Navbar, NavbarContainer } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense fallback={<Navbar session={null} />}>
        <NavbarContainer />
      </Suspense>
      <main className="flex-1 min-h-screen bg-background flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
