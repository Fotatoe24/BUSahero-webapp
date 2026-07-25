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

  const { email, password, fullName, fleetName } = await req.json();

  if (!email || !password || !fullName) {
    return NextResponse.json(
      { error: "Email, password, and full name are required." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();

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

  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabaseAdmin
    .from("operators")
    .insert({
      email: normalizedEmail,
      password_hash: passwordHash,
      full_name: fullName,
      fleet_name: fleetName || null,
    })
    .select("id, email")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Could not create account." },
      { status: 500 }
    );
  }

  await createSession({ operatorId: data.id, email: data.email });

  return NextResponse.json({ ok: true });
}
