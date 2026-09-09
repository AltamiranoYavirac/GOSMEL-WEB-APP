import { NextResponse } from "next/server"

import { updateUsuarioActivoServer } from "@/features/usuarios/server"

interface IStatusBody {
  activo?: unknown
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ data: null, error }, { status })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = (await request.json().catch(() => null)) as IStatusBody | null

  if (!body || typeof body.activo !== "boolean") {
    return jsonError("El estado de la cuenta no es válido", 400)
  }

  const result = await updateUsuarioActivoServer(id, body.activo)
  if (result.error) return jsonError(result.error, result.status)

  return NextResponse.json({ data: result.data, error: null })
}
