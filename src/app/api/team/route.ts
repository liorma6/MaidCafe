import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getTeamMembers, updateTeamMember } from "@/lib/db/team";

export async function GET() {
  try {
    const team = await getTeamMembers();
    return NextResponse.json(team);
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
    const { id, name, role, catchphrase } = (await request.json()) as {
      id?: string;
      name?: string;
      role?: string;
      catchphrase?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });
    }

    const member = await updateTeamMember(id, {
      name: name?.trim(),
      role: role?.trim(),
      catchphrase: catchphrase?.trim(),
    });

    return NextResponse.json(member);
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
  }
}
