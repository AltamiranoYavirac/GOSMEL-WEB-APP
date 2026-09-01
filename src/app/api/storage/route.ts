import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Ruta de archivo no especificada" }, { status: 400 });
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return NextResponse.redirect(path);
  }

  const cloudinaryUrl = `https://res.cloudinary.com/dv9lm0fnm/raw/upload/${path}`;
  return NextResponse.redirect(cloudinaryUrl);
}
