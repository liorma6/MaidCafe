import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAboutPage, updateAboutPage } from "@/lib/db/about";
import type { AboutInfoSection } from "@/lib/types";

function sanitizeInfoSections(sections: AboutInfoSection[]): AboutInfoSection[] {
  return sections
    .map((section) => ({
      title: section.title.trim(),
      items: section.items
        .map((item) => ({
          label: item.label.trim(),
          value: item.value.trim(),
        }))
        .filter((item) => item.label || item.value),
    }))
    .filter((section) => section.title || section.items.length > 0);
}

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
    const body = (await request.json()) as {
      title?: string;
      content?: string;
      image?: string;
      infoSections?: AboutInfoSection[];
    };

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "נא למלא כותרת" }, { status: 400 });
    }

    const current = await getAboutPage();
    const about = await updateAboutPage({
      title: body.title.trim(),
      content: body.content?.trim() ?? "",
      image: body.image !== undefined ? body.image : current.image,
      infoSections:
        body.infoSections !== undefined
          ? sanitizeInfoSections(body.infoSections)
          : current.infoSections,
    });
    return NextResponse.json(about);
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}
