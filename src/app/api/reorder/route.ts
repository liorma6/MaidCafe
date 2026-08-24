import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { moveSortOrder, type ReorderEntity } from "@/lib/db/reorder";
import { getAnnouncements } from "@/lib/db/announcements";
import { getTeamMembers } from "@/lib/db/team";
import { getPartnerships } from "@/lib/db/partnerships";
import { getMerch } from "@/lib/db/merch";

const ENTITIES = new Set<ReorderEntity>([
  "announcements",
  "team_members",
  "partnerships",
  "merch",
]);

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { entity, id, direction } = (await request.json()) as {
      entity?: ReorderEntity;
      id?: string;
      direction?: "up" | "down";
    };

    if (!entity || !ENTITIES.has(entity) || !id || !direction) {
      return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
    }

    await moveSortOrder(entity, id, direction);

    if (entity === "announcements") {
      return NextResponse.json({ items: await getAnnouncements() });
    }
    if (entity === "team_members") {
      return NextResponse.json({ items: await getTeamMembers() });
    }
    if (entity === "partnerships") {
      return NextResponse.json({ items: await getPartnerships() });
    }
    return NextResponse.json({ items: await getMerch() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "אין הרשאה" : message }, { status });
  }
}
