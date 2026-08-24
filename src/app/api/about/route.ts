import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAboutPage, updateAboutPage } from "@/lib/db/about";

export async function GET() {
  try {
    const about = await getAboutPage();
    return NextResponse.json(about);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "שגיאת שרת" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { title, content } = (await request.json()) as {
      title?: string;
      content?: string;
    };

    if (!title?.trim()) {
      return NextResponse.json({ error: "נא למלא כותרת" }, { status: 400 });
    }

    const about = await updateAboutPage({
      title: title.trim(),
      content: content?.trim() || "",
    });
    return NextResponse.json(about);
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
  }
}
