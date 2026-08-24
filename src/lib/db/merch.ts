import type { MerchItem } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getNextSortOrder } from "@/lib/db/reorder";

type MerchRow = {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  image: string | null;
  available: boolean;
  sort_order: number;
};

function mapMerch(row: MerchRow): MerchItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    price: row.price || "",
    image: row.image || "",
    available: row.available,
    sortOrder: row.sort_order,
  };
}

export async function getMerch(availableOnly = false): Promise<MerchItem[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("merch")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (availableOnly) {
    query = query.eq("available", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as MerchRow[]).map(mapMerch);
}

export async function createMerch(input: {
  title: string;
  description?: string;
  price?: string;
}): Promise<MerchItem> {
  const supabase = getSupabaseAdmin();
  const sortOrder = await getNextSortOrder("merch");

  const { data, error } = await supabase
    .from("merch")
    .insert({
      title: input.title,
      description: input.description || "",
      price: input.price || "",
      image: "",
      available: true,
      sort_order: sortOrder,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapMerch(data as MerchRow);
}

export async function updateMerch(
  id: string,
  input: {
    title?: string;
    description?: string;
    price?: string;
    available?: boolean;
    image?: string;
  },
): Promise<MerchItem> {
  const supabase = getSupabaseAdmin();
  const updates: Partial<MerchRow> = {};
  if (input.title) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;
  if (input.price !== undefined) updates.price = input.price;
  if (input.available !== undefined) updates.available = input.available;
  if (input.image !== undefined) updates.image = input.image;

  const { data, error } = await supabase
    .from("merch")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapMerch(data as MerchRow);
}

export async function deleteMerch(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("merch").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
