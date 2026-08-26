import type { FaqItem } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getNextSortOrder } from "@/lib/db/reorder";

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
  created_at: string;
};

function mapFaq(row: FaqRow): FaqItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    sortOrder: row.sort_order,
    active: row.active,
    createdAt: row.created_at,
  };
}

export async function getFaqItems(activeOnly = false): Promise<FaqItem[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("faq_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (activeOnly) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as FaqRow[]).map(mapFaq);
}

export async function createFaqItem(input: {
  question: string;
  answer: string;
}): Promise<FaqItem> {
  const supabase = getSupabaseAdmin();
  const sortOrder = await getNextSortOrder("faq_items");

  const { data, error } = await supabase
    .from("faq_items")
    .insert({
      question: input.question,
      answer: input.answer,
      sort_order: sortOrder,
      active: true,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapFaq(data as FaqRow);
}

export async function updateFaqItem(
  id: string,
  input: {
    question?: string;
    answer?: string;
    active?: boolean;
  },
): Promise<FaqItem> {
  const supabase = getSupabaseAdmin();
  const updates: Record<string, unknown> = {};
  if (input.question !== undefined) updates.question = input.question;
  if (input.answer !== undefined) updates.answer = input.answer;
  if (input.active !== undefined) updates.active = input.active;

  const { data, error } = await supabase
    .from("faq_items")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapFaq(data as FaqRow);
}

export async function deleteFaqItem(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
