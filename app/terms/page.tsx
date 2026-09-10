"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";
import { TERMS_CLAUSES, TERMS_EFFECTIVE_DATE } from "@/lib/termsContent";

const clauses = TERMS_CLAUSES;

export default function TermsPage() {
  return (
    <AuthGuard>
      <div className="shell">
        <Sidebar />

        <div className="main">
          <Topbar
            title="Terms & Conditions"
            subtitle="Terms & Conditions"
            source="mock"
          />

          <div className="content">
            <div className="info-heading">Terms & Conditions</div>

            <div
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 18,
                padding: 22,
                marginBottom: 20,
                alignItems: "flex-start",
              }}
            >
              <span className="icon-badge lg">📄</span>
              <div>
                <div className="info-card-title">Acceptance of Terms</div>
                <p className="info-card-body">
                  By using the BUSahero application, you agree to comply with
                  these Terms and Conditions. If you do not agree with any part
                  of these terms, please discontinue use of the application.
                </p>
              </div>
            </div>

            <div className="info-grid">
              {clauses.map((c, i) => (
                <div className="info-tile" key={c.title}>
                  <span className="info-tile-index">{i + 1}</span>
                  <span className="icon-badge">{c.icon}</span>
                  <div className="info-tile-title pr">{c.title}</div>
                  <div className="info-tile-body">{c.body}</div>
                </div>
              ))}
            </div>

            <div className="info-footnote">{TERMS_EFFECTIVE_DATE}</div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
