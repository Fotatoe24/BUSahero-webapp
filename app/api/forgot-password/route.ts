import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createResetToken } from "@/lib/passwordReset";
import { sendPasswordResetEmail } from "@/lib/resend";

export async function POST(req: Request) {
  const genericResponse = NextResponse.json({
    message: "If that email is registered, a reset link has been sent.",
  });

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      console.error("supabaseAdmin is not configured");
      return genericResponse;
    }

    const { data: operator, error } = await supabaseAdmin
      .from("operators")
      .select("id, email")
      .eq("email", email.toLowerCase().trim())
      .single();

    // Always return the generic message, even on a miss —
    // this avoids leaking which emails are registered.
    if (error || !operator) {
      return genericResponse;
    }

    const token = await createResetToken(operator.id, operator.email);

    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";
    const resetUrl = `${origin}/reset-password?token=${encodeURIComponent(
      token
    )}`;

    await sendPasswordResetEmail(operator.email, resetUrl);

    return genericResponse;
  } catch (err) {
    console.error("forgot-password error:", err);
    return genericResponse;
  }
}
