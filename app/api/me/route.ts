import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin, hasSupabaseConfig } from "@/lib/supabaseAdmin";

export async function GET() {
  const session = await getSession();

  if (!session || !hasSupabaseConfig || !supabaseAdmin) {
    return NextResponse.json({ operator: null });
  }

  const { data } = await supabaseAdmin
    .from("operators")
    .select("id, email, full_name, fleet_name")
    .eq("id", session.operatorId)
    .maybeSingle();

  return NextResponse.json({ operator: data ?? null });
}
