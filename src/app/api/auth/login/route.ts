import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "נא למלא מייל וסיסמה" },
        { status: 400 },
      );
    }

    if (!verifyCredentials(email, password)) {
      return NextResponse.json(
        { error: "מייל או סיסמה שגויים" },
        { status: 401 },
      );
    }

    await createSession(email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה בהתחברות" }, { status: 500 });
  }
}
