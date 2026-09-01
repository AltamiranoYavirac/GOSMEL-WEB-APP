import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/shared/api/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const filename = file.name;
    const extension = filename.split(".").pop()?.toLowerCase() ?? "";

    let tipo: "pdf" | "audio" | "video" | "partitura" | "enlace" = "pdf";
    let resourceType: "raw" | "auto" | "image" | "video" = "raw";

    if (["mp3", "wav", "aac", "m4a", "ogg", "flac"].includes(extension)) {
      tipo = "audio";
      resourceType = "video";
    } else if (["mp4", "webm", "mov", "avi", "mkv"].includes(extension)) {
      tipo = "video";
      resourceType = "video";
    } else if (["musicxml", "mxl", "xml", "mscz", "mid", "midi"].includes(extension)) {
      tipo = "partitura";
      resourceType = "raw";
    } else if (["pdf"].includes(extension)) {
      tipo = "pdf";
      resourceType = "raw";
    } else if (["png", "jpg", "jpeg", "webp"].includes(extension)) {
      tipo = "pdf";
      resourceType = "image";
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type || "application/octet-stream"};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "gosmel/materiales",
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    });

    return NextResponse.json({
      storage_path: result.secure_url || result.public_id,
      url: result.secure_url,
      public_id: result.public_id,
      tipo,
      filename,
      size: file.size,
      format: result.format || extension,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al procesar y subir el archivo";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
