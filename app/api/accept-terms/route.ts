import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin, hasSupabaseConfig } from "@/lib/supabaseAdmin";

// Persists Terms & Conditions acceptance on the signed-in operator's own
// account row, so it survives logout/login and browser restarts — see
// components/TermsGate.tsx, which calls this only after the operator
// explicitly clicks "I Accept".
export async function POST() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (!hasSupabaseConfig || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Server is not configured." },
      { status: 500 }
    );
  }

  const { error } = await supabaseAdmin
    .from("operators")
    .update({ terms_accepted: true })
    .eq("id", session.operatorId);

  if (error) {
    console.error(
      "Failed to persist terms acceptance (has the migration been run?):",
      error
    );

    return NextResponse.json(
      { error: "Could not save your acceptance. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
