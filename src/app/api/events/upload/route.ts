import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const eventId = formData.get("eventId") as string;
    const file = formData.get("file") as File | null;

    if (!eventId || !file) {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    const siteContent = await readContent();
    const event = siteContent.events.find((e) => e.id === eventId);
    if (!event) {
      return NextResponse.json({ error: "אירוע לא נמצא" }, { status: 404 });
    }

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "events");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const imagePath = `/uploads/events/${filename}`;
    event.images.push(imagePath);
    await writeContent(siteContent);

    return NextResponse.json({ image: imagePath, event });
  } catch {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { eventId, imagePath } = (await request.json()) as {
      eventId?: string;
      imagePath?: string;
    };

    if (!eventId || !imagePath) {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    const siteContent = await readContent();
    const event = siteContent.events.find((e) => e.id === eventId);
    if (!event) {
      return NextResponse.json({ error: "אירוע לא נמצא" }, { status: 404 });
    }

    event.images = event.images.filter((img) => img !== imagePath);
    await writeContent(siteContent);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
}
