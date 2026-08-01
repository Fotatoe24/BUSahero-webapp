"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    // Supabase's recovery link redirects here and sets a temporary
    // session automatically. We just confirm one exists before
    // letting the operator submit a new password.
    supabase.auth.getSession().then(({ data }) => {
      setReady(true);

      if (!data.session) {
        setError(
          "This reset link is invalid or has expired. Please request a new one."
        );
      }
    });
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setStatus("loading");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setStatus("idle");
      return;
    }

    setStatus("done");
    setTimeout(() => router.push("/"), 2000);
  }

  if (!ready) {
    return <p style={{ fontSize: 13.5 }}>Checking your reset link…</p>;
  }

  if (status === "done") {
    return (
      <p style={{ fontSize: 13.5 }}>
        Password updated! Redirecting you to login…
      </p>
    );
  }

  if (error && !password && !confirm) {
    return (
      <div>
        <p style={{ fontSize: 13.5, marginBottom: 12 }}>{error}</p>
        <Link
          href="/forgot-password"
          style={{ fontSize: 13.5, fontWeight: 600, color: "var(--blue-600)" }}
        >
          Request a new reset link →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="field-label" htmlFor="password">
        New password
      </label>

      <input
        id="password"
        type="password"
        className="text-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />

      <label className="field-label" htmlFor="confirm">
        Confirm new password
      </label>

      <input
        id="confirm"
        type="password"
        className="text-input"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        minLength={8}
        required
      />

      <div className={`form-error ${error ? "show" : ""}`}>{error}</div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center" }}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="modal-title" style={{ marginBottom: 6 }}>
          Reset your password
        </h1>

        <Suspense fallback={<p>Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>

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
