"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";

interface Practice {
  title: string;
  body: string;
}
const practices: Practice[] = [
  {
    title: "Information We Collect",
    body: "BUSahero may collect information necessary for system operations, such as operator account details, bus information, driver assignments, trip information, GPS location data, and system activity records.",
  },
  {
    title: "How We Use Information",
    body: "Collected information is used to support bus monitoring, real-time tracking, trip management, route monitoring, seat availability, reporting, and other authorized operational functions.",
  },
  {
    title: "GPS and Location Data",
    body: "BUSahero may collect and process the real-time location of buses equipped with the tracking system. Location data is used to display bus positions and support arrival-time estimation and operational monitoring.",
  },
  {
    title: "Data Accuracy and Updates",
    body: "Operators and management are responsible for ensuring that information they enter or update in BUSahero is accurate and current. Incorrect information may affect system results and operational monitoring.",
  },
  {
    title: "Data Protection and Confidentiality",
    body: "BUSahero information must be treated as confidential. Operators and management must not disclose, copy, distribute, or use operational information for purposes unrelated to authorized bus operations.",
  },
  {
    title: "Data Sharing and Disclosure",
    body: "Information collected through BUSahero should only be accessed or shared with authorized personnel and parties with a legitimate operational purpose, subject to applicable policies and requirements.",
  },
  {
    title: "Data Security and Account Protection",
    body: "Reasonable security measures are used to protect system information and user accounts. Operators and management are responsible for protecting their login credentials and reporting suspected unauthorized access or security incidents.",
  },
  {
    title: "Privacy Policy Updates",
    body: "This Privacy Policy may be updated when BUSahero's features, data practices, or operational requirements change. Users are encouraged to review the latest version of the policy when updates are made.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <AuthGuard>
      <div className="shell">
        <Sidebar />

        <div className="main">
          <Topbar
            title="Privacy Policy"
            subtitle="Privacy Policy"
            source="mock"
          />

          <div className="content">
            <div className="info-heading">Privacy Policy</div>

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
              <span className="icon-badge lg">🔒</span>
              <div>
                <div className="info-card-title">Introduction</div>
                <p className="info-card-body">
                  BUSahero respects your privacy. This Privacy Policy explains
                  how the application collects, uses, and protects your
                  information while providing real-time bus tracking and related
                  transportation services.
                </p>
              </div>
            </div>

            <div className="info-subheading">Our Privacy Practices</div>
            <div className="info-grid">
              {practices.map((p) => (
                <div className="info-tile" key={p.title}>
                  <div className="info-tile-title">{p.title}</div>
                  <div className="info-tile-body">{p.body}</div>
                </div>
              ))}
            </div>

            <div className="info-footnote">Last Updated: July 2026</div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
