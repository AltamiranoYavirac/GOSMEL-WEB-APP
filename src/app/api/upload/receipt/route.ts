import { NextRequest, NextResponse } from "next/server";

import { cloudinary } from "@/shared/api/cloudinary";
import { requireApiSession } from "@/features/session/server";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireApiSession(["admin", "docente", "estudiante", "representante"]);
    if (!auth.ok) return auth.response;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const resourceType = ["png", "jpg", "jpeg", "webp"].includes(extension) ? "image" : "raw";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type || "application/octet-stream"};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "gosmel/comprobantes",
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    });

    return NextResponse.json({
      storage_path: result.secure_url || result.public_id,
      url: result.secure_url,
      public_id: result.public_id,
      filename: file.name,
      size: file.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al subir el comprobante";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}