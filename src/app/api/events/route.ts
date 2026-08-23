import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/data";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content.events);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { title, date, description } = (await request.json()) as {
      title?: string;
      date?: string;
      description?: string;
    };

    if (!title?.trim()) {
      return NextResponse.json({ error: "נא למלא שם אירוע" }, { status: 400 });
    }

    const siteContent = await readContent();
    const event = {
      id: uuidv4(),
      title: title.trim(),
      date: date || new Date().toISOString().split("T")[0],
      description: description?.trim() || "",
      images: [] as string[],
    };

    siteContent.events.unshift(event);
    await writeContent(siteContent);
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { id } = (await request.json()) as { id?: string };
    if (!id) {
      return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });
    }

    const siteContent = await readContent();
    siteContent.events = siteContent.events.filter((e) => e.id !== id);
    await writeContent(siteContent);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, title, date, description } = (await request.json()) as {
      id?: string;
      title?: string;
      date?: string;
      description?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });
    }

    const siteContent = await readContent();
    const event = siteContent.events.find((e) => e.id === id);
    if (!event) {
      return NextResponse.json({ error: "אירוע לא נמצא" }, { status: 404 });
    }

    if (title) event.title = title.trim();
    if (date) event.date = date;
    if (description !== undefined) event.description = description.trim();

    await writeContent(siteContent);
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
}
