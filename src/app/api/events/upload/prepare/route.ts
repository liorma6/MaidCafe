import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth";
import { getStorageBucket, getSupabaseUrl } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
]);

function buildObjectPath(type: string, fileName: string): string {
  const ext = fileName.includes(".")
    ? fileName.slice(fileName.lastIndexOf("."))
    : type === "video"
      ? ".mp4"
      : ".jpg";
  const folder = type === "video" ? "events-videos" : "events";
  return `${folder}/${uuidv4()}${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { type, fileName, contentType } = (await request.json()) as {
      eventId?: string;
      type?: string;
      fileName?: string;
      contentType?: string;
    };

    if (!fileName?.trim()) {
      return NextResponse.json({ error: "חסר שם קובץ" }, { status: 400 });
    }

    const uploadType = type || "gallery";

    if (uploadType === "video" && contentType && !VIDEO_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: "סוג קובץ לא נתמך — העלו MP4, WebM או MOV" },
        { status: 400 },
      );
    }

    const path = buildObjectPath(uploadType, fileName.trim());
    const bucket = getStorageBucket();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "לא ניתן ליצור קישור העלאה" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      path: data.path,
      token: data.token,
      bucket,
      supabaseUrl: getSupabaseUrl(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}
