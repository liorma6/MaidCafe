import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
} from "@/lib/db/announcements";

export async function GET() {
  try {
    const announcements = await getAnnouncements(true);
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "שגיאת שרת" },
      { status: 500 },
    );
  }
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

    const announcement = await createAnnouncement(title.trim(), body.trim());
    return NextResponse.json(announcement);
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { id } = (await request.json()) as { id?: string };
    if (!id) {
      return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });
    }

    await deleteAnnouncement(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
  }
}
