import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAboutPage, updateAboutPage } from "@/lib/db/about";
import { uploadImage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "חסר קובץ תמונה" }, { status: 400 });
    }

    const current = await getAboutPage();
    const imageUrl = await uploadImage("about", file);
    const about = await updateAboutPage({
      title: current.title,
      content: current.content,
      image: imageUrl,
      infoSections: current.infoSections,
    });

    return NextResponse.json({ about });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}
