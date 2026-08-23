import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  createMerch,
  deleteMerch,
  getMerch,
  updateMerch,
} from "@/lib/db/merch";

export async function GET() {
  try {
    const merch = await getMerch();
    return NextResponse.json(merch);
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
    const { title, description, price } = (await request.json()) as {
      title?: string;
      description?: string;
      price?: string;
    };

    if (!title?.trim()) {
      return NextResponse.json({ error: "נא למלא שם מוצר" }, { status: 400 });
    }

    const item = await createMerch({
      title: title.trim(),
      description: description?.trim(),
      price: price?.trim(),
    });

    return NextResponse.json(item);
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

    await deleteMerch(id);
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

    const item = await updateMerch(id, {
      title: title?.trim(),
      description,
      price,
      available,
    });

    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
  }
}
