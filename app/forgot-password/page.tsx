"use client";

import { useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("loading");

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    // Always show success, same anti-enumeration reasoning as before
    if (error) console.error("resetPasswordForEmail error:", error);

    setStatus("sent");
  }
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="modal-title" style={{ marginBottom: 6 }}>
          Forgot your password?
        </h1>

        <p className="section-sub" style={{ marginBottom: 20 }}>
          Enter your operator email and we&apos;ll send you a reset link.
        </p>

        {status === "sent" ? (
          <p style={{ fontSize: 13.5 }}>
            If that email is registered, a reset link is on its way. Check your
            inbox (and spam folder).
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              className="text-input"
              placeholder="you@fleet.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <div className="form-error show">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <Link
          href="/"
          style={{
            display: "block",
            marginTop: 16,
            fontSize: 12.5,
            color: "var(--ink-500)",
          }}
        >
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
