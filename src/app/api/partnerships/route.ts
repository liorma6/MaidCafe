import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  createPartnership,
  deletePartnership,
  getPartnerships,
  updatePartnership,
} from "@/lib/db/partnerships";
import { uploadImage } from "@/lib/storage";

export async function GET() {
  try {
    const partnerships = await getPartnerships();
    return NextResponse.json(partnerships);
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
    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const file = formData.get("file") as File | null;

    if (!name) {
      return NextResponse.json({ error: "נא למלא שם עסק" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "נא לבחור תמונה" }, { status: 400 });
    }

    const imageUrl = await uploadImage("partnerships", file);
    const item = await createPartnership({
      name,
      description,
      image: imageUrl,
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

    await deletePartnership(id);
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
    const { id, name, description } = (await request.json()) as {
      id?: string;
      name?: string;
      description?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });
    }

    const item = await updatePartnership(id, {
      name: name?.trim(),
      description,
    });

    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
  }
}
