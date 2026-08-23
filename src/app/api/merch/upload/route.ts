import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updateMerch } from "@/lib/db/merch";
import { uploadImage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const merchId = formData.get("merchId") as string;
    const file = formData.get("file") as File | null;

    if (!merchId || !file) {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    const imageUrl = await uploadImage("merch", file);
    const item = await updateMerch(merchId, { image: imageUrl });

    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
  }
}
