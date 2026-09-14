"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { TERMS_CLAUSES } from "@/lib/termsContent";

/**
 * First-login Terms & Conditions gate.
 *
 * Mounted inside AuthProvider in app/layout.tsx so it has access to the
 * signed-in operator's own account data. Acceptance is persisted on that
 * account (operators.terms_accepted in Supabase, via /api/accept-terms —
 * see lib/useAuth.tsx's acceptTerms()), not component state, so it
 * survives logout/login and browser restarts.
 *
 * - Not signed in (or still checking the session): nothing to gate yet —
 *   `children` render normally so the login/register pages work.
 * - Signed in, terms_accepted is false: block `children` entirely behind
 *   the modal, same as before — the app can't be used accidentally.
 * - Signed in, terms_accepted is true: render `children` normally. Logs
 *   out and back in still shows this correctly per-account, since
 *   `operator` (and its terms_accepted) is re-fetched fresh on every
 *   sign-in.
 */
export default function TermsGate({ children }: { children: React.ReactNode }) {
  const { operator, loading, acceptTerms } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleAccept() {
    setSubmitting(true);
    setError("");

    const { error } = await acceptTerms();

    setSubmitting(false);

    if (error) {
      setError(error);
    }
  }

  if (loading || !operator) {
    return <>{children}</>;
  }

  if (!operator.terms_accepted) {
    return (
      <div className="modal-overlay">
        <div className="modal terms-modal">
          <div className="modal-head">
            <div className="modal-title">Terms &amp; Conditions</div>
          </div>

          <div className="modal-body">
            <p className="info-card-body" style={{ marginBottom: 14 }}>
              Welcome to BUSahero. Before you continue, please review and accept
              the following terms.
            </p>

            <div className="terms-modal-body">
              {TERMS_CLAUSES.map((clause) => (
                <div className="terms-clause-row" key={clause.title}>
                  <div>
                    <div className="info-tile-title">{clause.title}</div>
                    <div className="info-tile-body">{clause.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="section-sub" style={{ marginTop: 14 }}>
              Read the full{" "}
              <Link
                href="/terms"
                style={{ color: "var(--blue-600)", fontWeight: 600 }}
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                style={{ color: "var(--blue-600)", fontWeight: 600 }}
              >
                Privacy Policy
              </Link>{" "}
              anytime from the sidebar.
            </p>

            {error && (
              <div className="form-error show" style={{ marginTop: 10 }}>
                {error}
              </div>
            )}
          </div>

          <div className="modal-foot">
            <span className="section-sub">
              You must accept to use BUSahero.
            </span>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAccept}
              disabled={submitting}
              autoFocus
            >
              {submitting ? "Saving…" : "I Accept"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
