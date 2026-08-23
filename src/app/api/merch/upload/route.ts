import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const merchId = formData.get("merchId") as string;
    const file = formData.get("file") as File | null;

    if (!merchId || !file) {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    const siteContent = await readContent();
    const item = siteContent.merch.find((m) => m.id === merchId);
    if (!item) {
      return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
    }

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "merch");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    item.image = `/uploads/merch/${filename}`;
    await writeContent(siteContent);

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
}
