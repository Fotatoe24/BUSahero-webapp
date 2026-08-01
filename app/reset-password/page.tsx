"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

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

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Could not reset password.");
      }

      setStatus("done");
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not reset password."
      );
      setStatus("idle");
    }
  }

  if (!token) {
    return (
      <p style={{ fontSize: 13.5 }}>
        This reset link is missing a token. Please request a new one from the{" "}
        <Link href="/forgot-password">forgot password</Link> page.
      </p>
    );
  }

  if (status === "done") {
    return (
      <p style={{ fontSize: 13.5 }}>
        Password updated! Redirecting you to login…
      </p>
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

      {error && <div className="form-error show">{error}</div>}

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
