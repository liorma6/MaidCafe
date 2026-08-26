import { getSupabaseAdmin } from "@/lib/supabase";

export type ReorderEntity =
  | "announcements"
  | "team_members"
  | "partnerships"
  | "merch"
  | "faq_items";

const TABLE_MAP: Record<ReorderEntity, string> = {
  announcements: "announcements",
  team_members: "team_members",
  partnerships: "partnerships",
  merch: "merch",
  faq_items: "faq_items",
};

async function swapSortOrder(
  table: string,
  idA: string,
  orderA: number,
  idB: string,
  orderB: number,
) {
  const supabase = getSupabaseAdmin();
  const { error: errA } = await supabase
    .from(table)
    .update({ sort_order: orderB })
    .eq("id", idA);
  if (errA) throw new Error(errA.message);

  const { error: errB } = await supabase
    .from(table)
    .update({ sort_order: orderA })
    .eq("id", idB);
  if (errB) throw new Error(errB.message);
}

export async function moveSortOrder(
  entity: ReorderEntity,
  id: string,
  direction: "up" | "down",
): Promise<void> {
  const table = TABLE_MAP[entity];
  const supabase = getSupabaseAdmin();

  if (entity === "announcements") {
    const { data: current, error } = await supabase
      .from(table)
      .select("id, pinned, sort_order")
      .eq("id", id)
      .single();
    if (error || !current) throw new Error("פריט לא נמצא");

    const { data: group, error: groupErr } = await supabase
      .from(table)
      .select("id, sort_order")
      .eq("pinned", current.pinned)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (groupErr) throw new Error(groupErr.message);

    const idx = group.findIndex((row) => row.id === id);
    if (idx === -1) throw new Error("פריט לא נמצא");

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= group.length) return;

    const neighbor = group[targetIdx];
    await swapSortOrder(
      table,
      current.id,
      current.sort_order as number,
      neighbor.id,
      neighbor.sort_order as number,
    );
    return;
  }

  const { data: rows, error } = await supabase
    .from(table)
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);

  const idx = rows.findIndex((row) => row.id === id);
  if (idx === -1) throw new Error("פריט לא נמצא");

  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= rows.length) return;

  const current = rows[idx];
  const neighbor = rows[targetIdx];
  await swapSortOrder(
    table,
    current.id,
    current.sort_order as number,
    neighbor.id,
    neighbor.sort_order as number,
  );
}

export async function getNextSortOrder(table: ReorderEntity): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE_MAP[table])
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return 0;
  return (data[0].sort_order as number) + 1;
}
