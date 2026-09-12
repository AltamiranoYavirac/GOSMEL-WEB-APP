import { NextRequest, NextResponse } from "next/server"

import { eliminarAvatarServer, subirAvatarServer } from "@/features/perfil/server"
import { requireApiSession } from "@/features/session/server"

function jsonError(error: string, status: number) {
  return NextResponse.json({ data: null, error }, { status })
}

export async function POST(req: NextRequest) {
  const auth = await requireApiSession()
  if (!auth.ok) return auth.response

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return jsonError("No se proporcionó ningún archivo", 400)
  }

  const result = await subirAvatarServer(auth.session, file)
  if (result.error || !result.data) {
    return jsonError(result.error ?? "No se pudo subir la foto de perfil", result.status)
  }

  return NextResponse.json({
    public_id: result.data.publicId,
    secure_url: result.data.url,
    error: null,
  })
}

export async function DELETE() {
  const auth = await requireApiSession()
  if (!auth.ok) return auth.response

  const result = await eliminarAvatarServer(auth.session)
  if (result.error) return jsonError(result.error, result.status)

  return NextResponse.json({ data: result.data, error: null })
}
