import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { readContent, writeContent } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      phone?: string;
      age?: string;
      experience?: string;
      message?: string;
    };

    const { fullName, email, phone, age, experience, message } = body;

    if (!fullName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "נא למלא שם, מייל וטלפון" },
        { status: 400 },
      );
    }

    const siteContent = await readContent();
    const application = {
      id: uuidv4(),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      age: age?.trim() || "",
      experience: experience?.trim() || "",
      message: message?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    siteContent.applications.unshift(application);
    await writeContent(siteContent);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה בשליחת הטופס" }, { status: 500 });
  }
}
