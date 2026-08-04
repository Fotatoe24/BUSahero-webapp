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
    icon: "👥",
    title: "Serve Commuters",
    body: "Provide passengers with accurate and timely transportation information for better travel planning.",
  },
  {
    icon: "🚩",
    title: "Improve Accessibility",
    body: "Enable commuters to easily monitor bus locations and estimated arrival times in real time.",
  },
  {
    icon: "⏱️",
    title: "Reduce Waiting Time",
    body: "Help passengers minimize unnecessary waiting through reliable arrival time estimation.",
  },
  {
    icon: "🚌",
    title: "Enhance Public Transportation",
    body: "Support more organized and efficient bus transportation services through modern technology.",
  },
  {
    icon: "💡",
    title: "Promote Innovation",
    body: "Develop practical technological solutions that contribute to smarter and more connected transportation systems.",
  },
];

export default function MissionPage() {
  return (
    <AuthGuard>
      <div className="shell">
        <Sidebar />

        <div className="main">
          <Topbar title="Mission" subtitle="Mission" source="mock" />

          <div className="content">
            <div className="info-heading">Mission</div>

            <div className="info-hero">
              <div>
                <span className="icon-badge">🚩</span>
                <div className="info-card-title">Our Mission</div>
                <p className="info-card-body">
                  Our mission is to develop a reliable and user-friendly web
                  application that empowers commuters by providing real-time bus
                  tracking, accurate arrival time estimation, seat availability
                  information, and fare computation. Through innovative
                  GPS-based tracking and intelligent transportation tools,
                  BUSahero aims to improve the daily commuting experience,
                  reduce waiting time, and promote a safer, more efficient, and
                  more convenient public transportation system between Olongapo
                  City and Zambales.
                </p>
              </div>

              <div className="info-hero-illustration" aria-hidden="true">
                🚌
              </div>
            </div>

            <div className="info-subheading underline">Our Mission Goals</div>
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
