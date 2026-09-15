import { NextRequest, NextResponse } from "next/server";

import { requireApiSession } from "@/features/session/server";
import { cloudinary } from "@/shared/api/cloudinary";
import {
  CLOUDINARY_IMAGE_FOLDERS,
  CLOUDINARY_IMAGE_TYPES,
  CLOUDINARY_MAX_IMAGE_SIZE,
  isAllowedCloudinaryFolder,
} from "@/shared/config";

const MAX_DISPLAY_NAME_LENGTH = 120;
const MAX_TAGS = 10;

function parseUploadMeta(displayName: FormDataEntryValue | null, tags: FormDataEntryValue | null) {
  const parsedDisplayName =
    typeof displayName === "string" ? displayName.trim().slice(0, MAX_DISPLAY_NAME_LENGTH) : "";
  const parsedTags =
    typeof tags === "string"
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .slice(0, MAX_TAGS)
      : [];

  return { displayName: parsedDisplayName, tags: parsedTags };
}

function isManagedPublicId(publicId: string): boolean {
  return CLOUDINARY_IMAGE_FOLDERS.some((folder) => publicId.startsWith(`${folder}/`));
}

export async function POST(req: NextRequest) {
  const auth = await requireApiSession(["admin"]);
  if (!auth.ok) return auth.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo." }, { status: 400 });
    }
    if (typeof folder !== "string" || !isAllowedCloudinaryFolder(folder)) {
      return NextResponse.json({ error: "La carpeta de destino no es válida." }, { status: 400 });
    }
    if (!(CLOUDINARY_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json({ error: "El archivo debe ser JPG, PNG o WEBP." }, { status: 400 });
    }
    if (file.size > CLOUDINARY_MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "La imagen supera el límite de 10 MB." }, { status: 400 });
    }

    const meta = parseUploadMeta(formData.get("display_name"), formData.get("tags"));
    const bytes = await file.arrayBuffer();
    const base64Data = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64Data, {
      folder,
      resource_type: "image",
      ...(meta.displayName ? { display_name: meta.displayName } : {}),
      ...(meta.tags.length > 0 ? { tags: meta.tags } : {}),
    });

    return NextResponse.json({
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo subir la imagen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireApiSession(["admin"]);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const publicId = typeof body.publicId === "string" ? body.publicId : "";

    if (!publicId || !isManagedPublicId(publicId)) {
      return NextResponse.json({ error: "La imagen no pertenece a una carpeta administrada." }, { status: 400 });
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo eliminar la imagen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
