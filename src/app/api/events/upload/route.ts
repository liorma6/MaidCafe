import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  addEventImage,
  removeEventImage,
  updateEventCover,
} from "@/lib/db/events";
import { deleteImageByUrl, uploadImage } from "@/lib/storage";

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
      type?: "cover" | "gallery";
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

    await removeEventImage(eventId, imagePath);
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
