import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "@/lib/db/events";

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events);
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
    const { title, date, description } = (await request.json()) as {
      title?: string;
      date?: string;
      description?: string;
    };

    if (!title?.trim()) {
      return NextResponse.json({ error: "נא למלא שם אירוע" }, { status: 400 });
    }

    const event = await createEvent({
      title: title.trim(),
      date: date || new Date().toISOString().split("T")[0],
      description: description?.trim(),
    });

    return NextResponse.json(event);
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

    await deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
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

    const event = await updateEvent(id, {
      title: title?.trim(),
      date,
      description,
    });

    return NextResponse.json(event);
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
  }
}
