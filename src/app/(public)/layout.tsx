import { redirect } from "next/navigation";

import { getServerSession } from "@/features/session/server";
import { Navbar } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sessionResult = await getServerSession();

  if (sessionResult.kind === "error") {
    throw new Error(sessionResult.error);
  }

  if (sessionResult.data?.isActive === false) {
    redirect("/auth/signout?reason=inactive");
  }

  return (
    <>
      <Navbar session={sessionResult.data} />
      <main className="flex-1 min-h-screen bg-background flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
