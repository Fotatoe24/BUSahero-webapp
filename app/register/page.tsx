"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [fleetName, setFleetName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setSubmitting(false);
      return;
    }

    const { error } = await signUp(email, password, fullName, fleetName);

    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }

    router.push("/login");
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
          <div className="modal-title">Register as Operator</div>
        </div>

        <div className="modal-body">
          <label className="field-label" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            className="text-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label className="field-label" htmlFor="fleetName">
            Fleet / company name
          </label>
          <input
            id="fleetName"
            className="text-input"
            value={fleetName}
            onChange={(e) => setFleetName(e.target.value)}
          />

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
            Already registered?{" "}
            <Link
              href="/login"
              style={{ color: "var(--blue-600)", fontWeight: 600 }}
            >
              Sign in
            </Link>
          </span>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Creating account…" : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
