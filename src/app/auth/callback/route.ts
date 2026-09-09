import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { exchangeOAuthCode, getServerSession } from "@/features/session/server";
import { resolvePostLoginRoute } from "@/entities/user";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const { error } = await exchangeOAuthCode(code);
    if (!error) {
      const session = await getServerSession();
      if (session.kind === "error") {
        return NextResponse.json({ error: "No se pudo validar la sesi\u00f3n" }, { status: 500 });
      }
      if (session.data?.isActive === false) {
        return NextResponse.redirect(`${origin}/auth/signout?reason=inactive`);
      }
      if (session.data) {
        return NextResponse.redirect(
          `${origin}${resolvePostLoginRoute(next, session.data.roles)}`,
        );
      }

      return NextResponse.redirect(`${origin}/auth/signout`);
    }
  }

  const loginUrl = new URL("/login", origin);
  if (searchParams.get("reason")) {
    loginUrl.searchParams.set("reason", searchParams.get("reason")!);
  }
  return NextResponse.redirect(loginUrl);
}
