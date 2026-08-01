import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseConfig } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  if (!hasSupabaseConfig || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Server is not configured." },
      { status: 500 }
    );
  }

  const { email, password, full_name, fleet_name } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // Create the Supabase Auth user first — its id becomes the
  // operators.id so useAuth's profile lookup lines up.
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
    });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message || "Could not create account." },
      { status: 400 }
    );
  }

  const { error: profileError } = await supabaseAdmin.from("operators").insert({
    id: authData.user.id,
    email: normalizedEmail,
    full_name: full_name ?? "",
    fleet_name: fleet_name ?? "",
  });

  if (profileError) {
    // Roll back the auth user so we don't leave an orphaned account
    // with no matching operator profile.
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

    console.error("register profile insert error:", profileError);
    return NextResponse.json(
      { error: "Could not create operator profile." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
