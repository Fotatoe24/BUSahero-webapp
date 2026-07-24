"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    router.push("/");
  }

  return (
    <div
      className="modal-overlay"
      style={{
        position: "static",
        minHeight: "100vh",
        background: "var(--paper)",
      }}
    >
      <form className="modal" style={{ width: 380 }} onSubmit={handleSubmit}>
        <div className="modal-head">
          <div className="modal-title">Operator Sign In</div>
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
