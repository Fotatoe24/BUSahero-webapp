import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyResetToken } from "@/lib/passwordReset";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    let payload;
    try {
      payload = await verifyResetToken(token);
    } catch {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (!supabaseAdmin) {
      console.error("reset-password error: supabaseAdmin is not initialized");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin
      .from("operators")
      .update({ password_hash: passwordHash }) // adjust column name if different
      .eq("id", payload.sub);

    if (error) {
      console.error("reset-password update error:", error);
      return NextResponse.json(
        { error: "Could not reset password. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Password updated. You can now log in.",
    });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
