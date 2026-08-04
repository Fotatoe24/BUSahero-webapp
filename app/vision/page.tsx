"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";

interface Goal {
  icon: string;
  title: string;
  body: string;
}

const goals: Goal[] = [
  {
    icon: "🌍",
    title: "Smarter Transportation",
    body: "Promote the adoption of intelligent transportation technologies that improve the efficiency of public transit services.",
  },
  {
    icon: "👥",
    title: "Better Commuting Experience",
    body: "Create a transportation environment where commuters can travel with confidence using reliable real-time information.",
  },
  {
    icon: "💡",
    title: "Continuous Innovation",
    body: "Encourage the continuous development of digital solutions that address transportation challenges.",
  },
  {
    icon: "✅",
    title: "Reliable Information",
    body: "Deliver accurate and dependable tracking and arrival estimates that commuters can trust.",
  },
  {
    icon: "🤝",
    title: "Community Impact",
    body: "Support communities by making public transportation more accessible, efficient, and user-friendly.",
  },
];

export default function VisionPage() {
  return (
    <AuthGuard>
      <div className="shell">
        <Sidebar />

        <div className="main">
          <Topbar title="Vision" subtitle="Vision" source="mock" />

          <div className="content">
            <div className="info-heading">Vision</div>

            <div className="info-hero">
              <div>
                <span className="icon-badge">👁️</span>
                <div className="info-card-title">Our Vision</div>
                <p className="info-card-body">
                  Our vision is to become a trusted and innovative
                  transportation solution that transforms the commuting
                  experience through smart technology. BUSahero envisions a
                  future where every commuter has access to accurate, real-time
                  transportation information, enabling safer, faster, and more
                  convenient travel while supporting the modernization of public
                  transportation systems in the Philippines.
                </p>
              </div>

              <div className="info-hero-illustration" aria-hidden="true">
                🚌
              </div>
            </div>

            <div className="info-subheading underline">Our Vision Goals</div>
            <div className="info-grid cols-5">
              {goals.map((g) => (
                <div className="info-tile" key={g.title}>
                  <span className="icon-badge">{g.icon}</span>
                  <div className="info-tile-title">{g.title}</div>
                  <div className="info-tile-body">{g.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
