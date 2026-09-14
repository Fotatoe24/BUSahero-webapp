import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin, hasSupabaseConfig } from "@/lib/supabaseAdmin";

export async function GET() {
  const session = await getSession();

  if (!session || !hasSupabaseConfig || !supabaseAdmin) {
    return NextResponse.json({ operator: null });
  }

  const { data, error } = await supabaseAdmin
    .from("operators")
    .select("id, email, full_name, fleet_name, terms_accepted")
    .eq("id", session.operatorId)
    .maybeSingle();

  if (error) {
    // Most likely cause: the terms_accepted column hasn't been added yet
    // (see supabase/migrations/add_terms_accepted.sql). Fall back to the
    // original columns rather than silently treating every signed-in
    // operator as logged out until the migration is run.
    console.error(
      "Failed to select terms_accepted (has the migration been run?):",
      error
    );

    const fallback = await supabaseAdmin
      .from("operators")
      .select("id, email, full_name, fleet_name")
      .eq("id", session.operatorId)
      .maybeSingle();

    const operator = fallback.data
      ? { ...fallback.data, terms_accepted: false }
      : null;

    return NextResponse.json({ operator });
  }

  return NextResponse.json({ operator: data ?? null });
}
