"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";

interface Practice {
  icon: string;
  title: string;
  body: string;
}

const practices: Practice[] = [
  {
    icon: "🗺️",
    title: "Location Information",
    body: "The application may access your device's location to display your current position on the map and provide navigation-related services. Your location is used only while the application is running.",
  },
  {
    icon: "🚌",
    title: "Real-Time Bus Tracking",
    body: "BUSahero displays the real-time location of buses using GPS data transmitted by the bus tracking device. This information is intended solely to help commuters monitor bus movements.",
  },
  {
    icon: "🖥️",
    title: "Data Collection",
    body: "The application may store limited information such as user preferences, trip history, and system settings to improve the overall user experience.",
  },
  {
    icon: "🛡️",
    title: "Data Protection",
    body: "Reasonable security measures are implemented to protect stored information from unauthorized access, misuse, or disclosure.",
  },
  {
    icon: "🔗",
    title: "Information Sharing",
    body: "BUSahero does not sell, rent, or intentionally share users' personal information with third parties unless required by law or with the user's consent.",
  },
  {
    icon: "🔄",
    title: "Policy Updates",
    body: "This Privacy Policy may be updated periodically to reflect improvements or changes in the application. Continued use of the application indicates acceptance of the updated policy.",
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
                  <span className="icon-badge">{p.icon}</span>
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
