import { redirect } from "next/navigation";

import { getServerSession } from "@/features/session/server";

import Navbar from "./Navbar";

export default async function NavbarContainer() {
  const sessionResult = await getServerSession();

  if (sessionResult.kind === "error") {
    throw new Error(sessionResult.error);
  }

  if (sessionResult.data?.isActive === false) {
    redirect("/auth/signout?reason=inactive");
  }

  return <Navbar session={sessionResult.data} />;
}
