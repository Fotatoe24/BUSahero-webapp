"use client";

import { useState } from "react";
import { TERMS_CLAUSES } from "@/lib/termsContent";

/**
 * Application-level entry point for Terms & Conditions consent.
 *
 * Mounted once in app/layout.tsx (above everything, including the login
 * screen) so it appears whenever BUSahero is opened, regardless of which
 * route is landed on. Acceptance is intentionally NOT persisted anywhere
 * (no localStorage/sessionStorage/cookie) — `accepted` is plain in-memory
 * React state, so it only lasts for the current app opening. A full page
 * reload re-runs this component from scratch and the modal appears again;
 * navigating between pages within the same opening does not remount this
 * component (it lives in the root layout), so it correctly stays accepted
 * during normal in-app navigation. `children` are not rendered at all
 * until acceptance is confirmed, so the app can't be used behind the modal
 * by accident.
 */
export default function TermsGate({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState(false);

  function handleAccept() {
    setAccepted(true);
  }

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
