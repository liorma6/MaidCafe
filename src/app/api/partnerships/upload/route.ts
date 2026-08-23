import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updatePartnership } from "@/lib/db/partnerships";
import { uploadImage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const partnershipId = formData.get("partnershipId") as string;
    const file = formData.get("file") as File | null;

    if (!partnershipId || !file) {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    const imageUrl = await uploadImage("partnerships", file);
    const item = await updatePartnership(partnershipId, { image: imageUrl });

    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
  }
}
