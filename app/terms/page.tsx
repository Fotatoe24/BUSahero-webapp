"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";

interface Clause {
  icon: string;
  title: string;
  body: string;
}

const clauses: Clause[] = [
  {
    icon: "📱",
    title: "Use of the Application",
    body: "BUSahero is intended to provide commuters with real-time bus tracking, estimated arrival times, seat availability, and fare computation. Users agree to use the application only for lawful and personal transportation purposes.",
  },
  {
    icon: "⏱️",
    title: "Arrival Time Estimates",
    body: "Estimated arrival times (ETA) are calculated using GPS location and distance data. Actual arrival times may vary due to traffic conditions, road closures, weather, driver decisions, or network interruptions.",
  },
  {
    icon: "📍",
    title: "GPS Accuracy",
    body: "Bus location updates depend on GPS signals and internet connectivity. Temporary inaccuracies or delays in location updates may occur.",
  },
  {
    icon: "⚠️",
    title: "Limitation of Liability",
    body: "The developers are not responsible for any inconvenience, delays, missed trips, or losses resulting from inaccurate GPS data, ETA estimates, or temporary service interruptions.",
  },
  {
    icon: "✅",
    title: "User Responsibility",
    body: "Users are responsible for using the application appropriately and should not misuse, modify, attempt unauthorized access, or interfere with the application's operation.",
  },
  {
    icon: "🔄",
    title: "Changes to the Terms",
    body: "These Terms and Conditions may be updated as the application is improved. Continued use of BUSahero after updates indicates acceptance of the revised terms.",
  },
];

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

            <div className="info-footnote">Effective Date: July 2026</div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
