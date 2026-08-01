import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseConfig } from "@/lib/supabaseAdmin";
import { createResetToken } from "@/lib/passwordReset";
import { sendPasswordResetEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  // Always return the same generic message — registered or not — so this
  // endpoint can't be used to enumerate which emails have accounts.
  const genericResponse = NextResponse.json({
    message: "If that email is registered, a reset link has been sent.",
  });

  if (!hasSupabaseConfig || !supabaseAdmin) {
    console.error("forgot-password: Supabase is not configured");
    return genericResponse;
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // operators is the single source of truth for who's a valid user —
    // no auth.users involved anywhere in this app.
    const { data: operator, error: lookupError } = await supabaseAdmin
      .from("operators")
      .select("id, email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (lookupError || !operator) {
      return genericResponse;
    }

    const token = await createResetToken(operator.id, operator.email);

    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";
    const resetUrl = `${origin}/reset-password?token=${encodeURIComponent(token)}`;

    await sendPasswordResetEmail(operator.email, resetUrl);

    return genericResponse;
  } catch (err) {
    console.error("forgot-password error:", err);
    return genericResponse;
  }
}
