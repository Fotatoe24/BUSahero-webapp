"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    router.replace("/dashboard");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { error } = await signIn(email, password);

    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--paper)",
      }}
    >
      <form className="modal" style={{ width: 380 }} onSubmit={handleSubmit}>
        <div className="modal-head">
          <div>
            <div className="modal-title">BUSAhero</div>
            <div className="section-sub">Operator Sign In</div>
          </div>
        </div>

        <div className="modal-body">
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="text-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="text-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={`form-error ${error ? "show" : ""}`}>{error}</div>
        </div>

        <div className="modal-foot">
          <span style={{ fontSize: 12.5 }}>
            No account?{" "}
            <Link
              href="/register"
              style={{ color: "var(--blue-600)", fontWeight: 600 }}
            >
              Register
            </Link>
          </span>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
