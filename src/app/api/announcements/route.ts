import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/data";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content.announcements.filter((a) => a.active));
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { title, content: body } = (await request.json()) as {
      title?: string;
      content?: string;
    };

    if (!title?.trim() || !body?.trim()) {
      return NextResponse.json({ error: "נא למלא כותרת ותוכן" }, { status: 400 });
    }

    const siteContent = await readContent();
    const announcement = {
      id: uuidv4(),
      title: title.trim(),
      content: body.trim(),
      createdAt: new Date().toISOString(),
      active: true,
    };

    siteContent.announcements.unshift(announcement);
    await writeContent(siteContent);
    return NextResponse.json(announcement);
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
    siteContent.announcements = siteContent.announcements.filter(
      (a) => a.id !== id,
    );
    await writeContent(siteContent);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
}
