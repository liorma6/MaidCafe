import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/data";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content.team);
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, name, role, catchphrase } = (await request.json()) as {
      id?: string;
      name?: string;
      role?: string;
      catchphrase?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });
    }

    const siteContent = await readContent();
    const member = siteContent.team.find((t) => t.id === id);
    if (!member) {
      return NextResponse.json({ error: "חבר צוות לא נמצא" }, { status: 404 });
    }

    if (name) member.name = name.trim();
    if (role) member.role = role.trim();
    if (catchphrase) member.catchphrase = catchphrase.trim();

    await writeContent(siteContent);
    return NextResponse.json(member);
  } catch {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
}
