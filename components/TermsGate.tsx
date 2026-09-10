"use client";

import { useEffect, useState } from "react";
import { TERMS_CLAUSES } from "@/lib/termsContent";

const STORAGE_KEY = "busahero_terms_accepted_v1";

/**
 * Application-level entry point for Terms & Conditions consent.
 *
 * Mounted once in app/layout.tsx (above everything, including the login
 * screen) so it appears the first time anyone opens BUSahero, regardless
 * of which route they land on, and never again afterward — consent is
 * remembered in localStorage since the app has no account-level consent
 * mechanism yet. `children` are not rendered at all until acceptance is
 * confirmed, so the app can't be used behind the modal by accident.
 */
export default function TermsGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    let alreadyAccepted = false;

    try {
      alreadyAccepted = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      alreadyAccepted = false;
    }

    setAccepted(alreadyAccepted);
    setReady(true);
  }, []);

  function handleAccept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage unavailable (private mode, etc.) — still let the
      // user through for this session rather than blocking them.
    }

    setAccepted(true);
  }

  if (!ready) return null;

  if (!accepted) {
    return (
      <div className="modal-overlay">
        <div className="modal terms-modal">
          <div className="modal-head">
            <div className="modal-title">Terms &amp; Conditions</div>
          </div>

          <div className="modal-body">
            <p className="info-card-body" style={{ marginBottom: 14 }}>
              Welcome to BUSahero. Before you continue, please review and
              accept the following terms.
            </p>

            <div className="terms-modal-body">
              {TERMS_CLAUSES.map((clause) => (
                <div className="terms-clause-row" key={clause.title}>
                  <span className="icon-badge" aria-hidden="true">
                    {clause.icon}
                  </span>
                  <div>
                    <div className="info-tile-title">{clause.title}</div>
                    <div className="info-tile-body">{clause.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-foot">
            <span className="section-sub">
              You must accept to use BUSahero.
            </span>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAccept}
              autoFocus
            >
              I Accept
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
