import { NextRequest, NextResponse } from "next/server";

import { cloudinary } from "@/shared/api/cloudinary";
import { requireApiSession } from "@/features/session/server";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireApiSession(["admin", "estudiante", "representante"]);
    if (!auth.ok) return auth.response;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: "Formato no permitido. Usa JPG, PNG, WEBP o PDF." }, { status: 400 });
    }
    if (file.size <= 0 || file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "El comprobante debe pesar máximo 8 MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const signature = buffer.subarray(0, 12);
    const isJpeg = signature.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
    const isPng = signature.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const isWebp = signature.subarray(0, 4).toString("ascii") === "RIFF" && signature.subarray(8, 12).toString("ascii") === "WEBP";
    const isPdf = signature.subarray(0, 5).toString("ascii") === "%PDF-";
    const signatureMatchesType =
      (file.type === "image/jpeg" && isJpeg) ||
      (file.type === "image/png" && isPng) ||
      (file.type === "image/webp" && isWebp) ||
      (file.type === "application/pdf" && isPdf);
    if (!signatureMatchesType) {
      return NextResponse.json({ error: "El contenido del archivo no coincide con el formato indicado." }, { status: 400 });
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
    const resourceType = isPdf ? "raw" : "image";
    const base64Data = `data:${file.type || "application/octet-stream"};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "gosmel/comprobantes",
      resource_type: resourceType,
      type: "authenticated",
      use_filename: true,
      unique_filename: true,
    });

    return NextResponse.json({
      storage_path: `${result.public_id}.${result.format || extension}`,
      url: null,
      public_id: result.public_id,
      filename: file.name,
      size: file.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al subir el comprobante";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
