import { NextRequest, NextResponse } from "next/server";

import { requireApiSession } from "@/features/session/server";
import { cloudinary } from "@/shared/api/cloudinary";

export async function GET(req: NextRequest) {
  const auth = await requireApiSession();
  if (!auth.ok) return auth.response;

  const searchParams = req.nextUrl.searchParams;
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Ruta de archivo no especificada" }, { status: 400 });
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return NextResponse.redirect(path);
  }

  if (path.startsWith("gosmel/comprobantes/")) {
    const dot = path.lastIndexOf(".");
    const format = dot > path.lastIndexOf("/") ? path.slice(dot + 1) : "pdf";
    const publicId = dot > path.lastIndexOf("/") ? path.slice(0, dot) : path;
    const resourceType = format.toLowerCase() === "pdf" ? "raw" : "image";
    const signedUrl = cloudinary.utils.private_download_url(publicId, format, {
      resource_type: resourceType,
      type: "authenticated",
      attachment: false,
    });
    return NextResponse.redirect(signedUrl);
  }

  const cloudinaryUrl = `https://res.cloudinary.com/dv9lm0fnm/raw/upload/${path}`;
  return NextResponse.redirect(cloudinaryUrl);
}
