import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/data";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content.merch);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { title, description, price } = (await request.json()) as {
      title?: string;
      description?: string;
      price?: string;
    };

    if (!title?.trim()) {
      return NextResponse.json({ error: "נא למלא שם מוצר" }, { status: 400 });
    }

    const siteContent = await readContent();
    const item = {
      id: uuidv4(),
      title: title.trim(),
      description: description?.trim() || "",
      price: price?.trim() || "",
      image: "",
      available: true,
    };

    siteContent.merch.unshift(item);
    await writeContent(siteContent);
    return NextResponse.json(item);
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
    siteContent.merch = siteContent.merch.filter((m) => m.id !== id);
    await writeContent(siteContent);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, title, description, price, available } = (await request.json()) as {
      id?: string;
      title?: string;
      description?: string;
      price?: string;
      available?: boolean;
    };

    if (!id) {
      return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });
    }

    const siteContent = await readContent();
    const item = siteContent.merch.find((m) => m.id === id);
    if (!item) {
      return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
    }

    if (title) item.title = title.trim();
    if (description !== undefined) item.description = description.trim();
    if (price !== undefined) item.price = price.trim();
    if (available !== undefined) item.available = available;

    await writeContent(siteContent);
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
}
