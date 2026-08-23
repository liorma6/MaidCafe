import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  addEventImage,
  addEventVideo,
  removeEventImage,
  removeEventVideo,
  updateEventCover,
} from "@/lib/db/events";
import { deleteImageByUrl, uploadImage, uploadVideo } from "@/lib/storage";

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
]);

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const eventId = formData.get("eventId") as string;
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "gallery";

    if (!eventId || !file) {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    if (type === "video") {
      if (!VIDEO_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: "סוג קובץ לא נתמך — העלו MP4, WebM או MOV" },
          { status: 400 },
        );
      }
      const videoUrl = await uploadVideo("events-videos", file);
      const event = await addEventVideo(eventId, videoUrl);
      return NextResponse.json({ video: videoUrl, event });
    }

    const imageUrl = await uploadImage("events", file);

    if (type === "cover") {
      const event = await updateEventCover(eventId, imageUrl);
      return NextResponse.json({ image: imageUrl, event });
    }

    const event = await addEventImage(eventId, imageUrl);
    return NextResponse.json({ image: imageUrl, event });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}

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
