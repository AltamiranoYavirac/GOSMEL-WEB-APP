import { NextResponse } from "next/server"

import type { TRol } from "@/entities/user"
import { getServerSession } from "./getServerSession"
import type { TApiSessionResult } from "./requireApiSession.types"

export async function requireApiSession(allowed?: TRol[]): Promise<TApiSessionResult> {
  const result = await getServerSession()

  if (result.kind === "error")
    return { ok: false, response: NextResponse.json({ data: null, error: result.error }, { status: 500 }) }

  if (result.kind === "anonymous")
    return { ok: false, response: NextResponse.json({ data: null, error: "No autenticado" }, { status: 401 }) }

  if (!result.data.isActive)
    return { ok: false, response: NextResponse.json({ data: null, error: "Cuenta inactiva" }, { status: 403 }) }

  if (allowed && !allowed.some((rol) => result.data.roles.includes(rol)))
    return { ok: false, response: NextResponse.json({ data: null, error: "Sin permisos" }, { status: 403 }) }

  return { ok: true, session: result.data }
}
