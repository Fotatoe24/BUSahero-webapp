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

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const { data: operator } = await supabaseAdmin
    .from("operators")
    .select("id, email, password_hash")
    .eq("email", normalizedEmail)
    .maybeSingle();

  // Same generic message either way — don't reveal whether the email exists.
  if (!operator) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, operator.password_hash);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  await createSession({ operatorId: operator.id, email: operator.email });

  return NextResponse.json({ ok: true });
}
