import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { signOutServer } from "@/features/session/server";

export async function GET(request: NextRequest) {
  const reason = request.nextUrl.searchParams.get("reason");
  const loginUrl = new URL("/login", request.url);
  if (reason === "inactive") loginUrl.searchParams.set("reason", reason);

  const response = NextResponse.redirect(loginUrl);
  const { error } = await signOutServer(request, response);
  if (error) {
    return NextResponse.json(
      { error: "No se pudo cerrar la sesión. Intenta nuevamente." },
      { status: 500 },
    );
  }

  return response;
}
