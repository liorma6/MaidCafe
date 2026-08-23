import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  updateTeamMemberChibiImage,
  updateTeamMemberImage,
} from "@/lib/db/team";
import { uploadImage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const memberId = formData.get("memberId") as string;
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "portrait";

    if (!memberId || !file) {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    const folder = type === "chibi" ? "team-chibi" : "team";
    const imageUrl = await uploadImage(folder, file);

    const member =
      type === "chibi"
        ? await updateTeamMemberChibiImage(memberId, imageUrl)
        : await updateTeamMemberImage(memberId, imageUrl);

    return NextResponse.json({ member });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}
