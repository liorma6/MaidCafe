import type { TeamMember } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase";

type TeamRow = {
  id: string;
  name: string;
  role: string;
  catchphrase: string;
  image: string;
  sort_order: number;
};

function mapTeamMember(row: TeamRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    catchphrase: row.catchphrase,
    image: row.image,
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as TeamRow[]).map(mapTeamMember);
}

export async function updateTeamMember(
  id: string,
  input: { name?: string; role?: string; catchphrase?: string },
): Promise<TeamMember> {
  const supabase = getSupabaseAdmin();
  const updates: Partial<TeamRow> = {};
  if (input.name) updates.name = input.name;
  if (input.role) updates.role = input.role;
  if (input.catchphrase) updates.catchphrase = input.catchphrase;

  const { data, error } = await supabase
    .from("team_members")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapTeamMember(data as TeamRow);
}

export async function createTeamMember(input: {
  name: string;
  role: string;
  catchphrase: string;
  image: string;
}): Promise<TeamMember> {
  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("team_members")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder =
    existing && existing.length > 0 ? (existing[0].sort_order as number) + 1 : 1;

  const { data, error } = await supabase
    .from("team_members")
    .insert({
      name: input.name,
      role: input.role,
      catchphrase: input.catchphrase,
      image: input.image,
      sort_order: nextOrder,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapTeamMember(data as TeamRow);
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateTeamMemberImage(
  id: string,
  image: string,
): Promise<TeamMember> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("team_members")
    .update({ image })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapTeamMember(data as TeamRow);
}
