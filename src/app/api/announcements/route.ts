import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
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
    const { title, content, category, pinned } = (await request.json()) as {
      title?: string;
      content?: string;
      category?: string;
      pinned?: boolean;
    };

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "נא למלא כותרת ותוכן" }, { status: 400 });
    }

    const announcement = await createAnnouncement({
      title: title.trim(),
      content: bodyTrim(content),
      category: category?.trim() || "",
      pinned: pinned ?? false,
    });
    return NextResponse.json(announcement);
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, title, content, category, pinned, active } = (await request.json()) as {
      id?: string;
      title?: string;
      content?: string;
      category?: string;
      pinned?: boolean;
      active?: boolean;
    };

    if (!id) {
      return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });
    }

    const announcement = await updateAnnouncement(id, {
      title: title?.trim(),
      content: content !== undefined ? bodyTrim(content) : undefined,
      category: category !== undefined ? category.trim() : undefined,
      pinned,
      active,
    });
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

function bodyTrim(value: string) {
  return value.trim();
}
