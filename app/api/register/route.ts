import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin, hasSupabaseConfig } from "@/lib/supabaseAdmin";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  if (!hasSupabaseConfig || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Server is not configured." },
      { status: 500 }
    );
  }

  const { email, password, full_name, fleet_name } = await req.json();

  if (!email || !password || !full_name) {
    return NextResponse.json(
      { error: "Full name, email, and password are required." },
      { status: 400 }
    );
  }

  if (String(password).length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // operators table is the single source of truth — check for an existing
  // account before creating a new one.
  const { data: existing } = await supabaseAdmin
    .from("operators")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(String(password), 10);

  const { data: operator, error: insertError } = await supabaseAdmin
    .from("operators")
    .insert({
      email: normalizedEmail,
      password_hash: passwordHash,
      full_name: String(full_name).trim(),
      fleet_name: fleet_name ? String(fleet_name).trim() : null,
    })
    .select("id, email")
    .single();

  if (insertError || !operator) {
    console.error("Failed to create operator:", insertError);

    return NextResponse.json(
      { error: "Could not create account. Please try again." },
      { status: 500 }
    );
  }

  await createSession({ operatorId: operator.id, email: operator.email });

  return NextResponse.json({ ok: true });
}
