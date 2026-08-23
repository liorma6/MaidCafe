import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  removeEventImage,
  removeEventVideo,
  updateEventCover,
} from "@/lib/db/events";
import { deleteImageByUrl } from "@/lib/storage";

/** File uploads use direct client → Supabase Storage via /prepare + /complete */
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { eventId, imagePath, type } = (await request.json()) as {
      eventId?: string;
      imagePath?: string;
      type?: "cover" | "gallery" | "video";
    };

    if (!eventId) {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    if (type === "cover") {
      const event = await updateEventCover(eventId, "");
      if (imagePath) await deleteImageByUrl(imagePath);
      return NextResponse.json({ event });
    }

    if (!imagePath) {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    if (type === "video") {
      await removeEventVideo(eventId, imagePath);
    } else {
      await removeEventImage(eventId, imagePath);
    }

    await deleteImageByUrl(imagePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}
