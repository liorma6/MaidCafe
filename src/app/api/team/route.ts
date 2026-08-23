import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMembers,
  updateTeamMember,
} from "@/lib/db/team";
import { uploadImage } from "@/lib/storage";

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

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim();
    const role = ((formData.get("role") as string) || "מייד").trim();
    const catchphrase = (formData.get("catchphrase") as string)?.trim();
    const file = formData.get("file") as File | null;

    if (!name || !catchphrase || !file) {
      return NextResponse.json(
        { error: "נא למלא שם, משפט תפיסה ותמונה" },
        { status: 400 },
      );
    }

    const imageUrl = await uploadImage("team", file);
    const member = await createTeamMember({
      name,
      role,
      catchphrase,
      image: imageUrl,
    });

    return NextResponse.json(member);
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
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
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { id } = (await request.json()) as { id?: string };
    if (!id) {
      return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });
    }

    await deleteTeamMember(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}
