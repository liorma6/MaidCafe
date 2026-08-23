import type { Partnership } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase";

type PartnershipRow = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  url: string | null;
  sort_order: number;
};

function mapPartnership(row: PartnershipRow): Partnership {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    image: row.image || "",
    url: row.url || "",
  };
}

export async function getPartnerships(): Promise<Partnership[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("partnerships")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as PartnershipRow[]).map(mapPartnership);
}

export async function createPartnership(input: {
  name: string;
  description?: string;
  image?: string;
  url?: string;
}): Promise<Partnership> {
  const supabase = getSupabaseAdmin();
  const { data: last } = await supabase
    .from("partnerships")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const sortOrder =
    last && last.length > 0 ? (last[0].sort_order as number) + 1 : 0;

  const { data, error } = await supabase
    .from("partnerships")
    .insert({
      name: input.name,
      description: input.description || "",
      image: input.image || "",
      url: input.url || "",
      sort_order: sortOrder,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapPartnership(data as PartnershipRow);
}

export async function updatePartnership(
  id: string,
  input: {
    name?: string;
    description?: string;
    image?: string;
    url?: string;
  },
): Promise<Partnership> {
  const supabase = getSupabaseAdmin();
  const updates: Partial<PartnershipRow> = {};
  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.image !== undefined) updates.image = input.image;
  if (input.url !== undefined) updates.url = input.url;

  const { data, error } = await supabase
    .from("partnerships")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapPartnership(data as PartnershipRow);
}

export async function deletePartnership(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("partnerships").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
