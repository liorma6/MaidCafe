import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  addEventImage,
  addEventVideo,
  updateEventCover,
} from "@/lib/db/events";
import { getStorageBucket } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { eventId, type, path } = (await request.json()) as {
      eventId?: string;
      type?: "cover" | "gallery" | "video";
      path?: string;
    };

    if (!eventId || !path?.trim()) {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    const uploadType = type || "gallery";
    const bucket = getStorageBucket();
    const supabase = getSupabaseAdmin();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path.trim());
    const publicUrl = data.publicUrl;

    if (uploadType === "video") {
      const event = await addEventVideo(eventId, publicUrl);
      return NextResponse.json({ event, url: publicUrl });
    }

    if (uploadType === "cover") {
      const event = await updateEventCover(eventId, publicUrl);
      return NextResponse.json({ event, url: publicUrl });
    }

    const event = await addEventImage(eventId, publicUrl);
    return NextResponse.json({ event, url: publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}
