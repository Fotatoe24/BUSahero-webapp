"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";

interface Developer {
  name: string;
  role: string;
}

const developers: Developer[] = [
  {
    name: "Angelica Aquino",
    role: "Full Stack Developer, UI/UX Designer, Hardware integration",
  },
  {
    name: "Krizia Mae F. Funiestas",
    role: "Mobile App Developer, Quality Assurance Engineer, and Testing",
  },
  {
    name: "Daisy Ann M. Magno",
    role: "Documentation Specialist, QA Tester",
  },
  {
    name: "Rhonielyn Mhei B. Tolentino",
    role: "System Analyst",
  },
];

const adviser: Developer = {
  name: "Rowela Gongora, MSCS",
  role: "Thesis Adviser",
};

interface Goal {
  icon: string;
  title: string;
  body: string;
}

const missionGoals: Goal[] = [
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

const visionGoals: Goal[] = [
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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function TeamCard({ dev, index }: { dev: Developer; index: number }) {
  return (
    <div className="team-card">
      <span className="team-card-index">{String(index).padStart(2, "0")}</span>

      <div className="team-photo-wrap no-photo" aria-hidden="true">
        {getInitials(dev.name)}
      </div>

      <div className="team-card-info">
        <div className="team-name">{dev.name}</div>
        <div className="team-role">{dev.role}</div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <AuthGuard>
      <div className="shell">
        <Sidebar />

        <div className="main">
          <Topbar title="About Us" subtitle="About BUSahero" source="mock" />

          <div className="content">
            <div className="info-heading">About BUSahero</div>

            {/* About the App */}
            <div className="info-hero">
              <div>
                <span className="icon-badge">🚌</span>
                <div className="info-card-title">About the App</div>
                <p className="info-card-body">
                  BUSahero is a web-based real-time bus tracking and arrival
                  estimation application developed to help commuters monitor
                  bus locations, estimate arrival times, check seat
                  availability, and calculate fares for trips between
                  Olongapo City and Zambales.
                </p>
              </div>

              <div className="info-hero-illustration" aria-hidden="true">
                🚌
              </div>
            </div>

            {/* Mission */}
            <div className="info-subheading underline">Mission</div>

            <div className="info-hero">
              <div>
                <span className="icon-badge">🚩</span>
                <div className="info-card-title">Our Mission</div>
                <p className="info-card-body">
                  Our mission is to develop a reliable and user-friendly web
                  application that empowers commuters by providing real-time
                  bus tracking, accurate arrival time estimation, seat
                  availability information, and fare computation. Through
                  innovative GPS-based tracking and intelligent transportation
                  tools, BUSahero aims to improve the daily commuting
                  experience, reduce waiting time, and promote a safer, more
                  efficient, and more convenient public transportation system
                  between Olongapo City and Zambales.
                </p>
              </div>

              <div className="info-hero-illustration" aria-hidden="true">
                🚩
              </div>
            </div>

            <div className="info-grid cols-5" style={{ marginTop: 14 }}>
              {missionGoals.map((g) => (
                <div className="info-tile" key={g.title}>
                  <span className="icon-badge">{g.icon}</span>
                  <div className="info-tile-title">{g.title}</div>
                  <div className="info-tile-body">{g.body}</div>
                </div>
              ))}
            </div>

            {/* Vision */}
            <div className="info-subheading underline">Vision</div>

            <div className="info-hero">
              <div>
                <span className="icon-badge">👁️</span>
                <div className="info-card-title">Our Vision</div>
                <p className="info-card-body">
                  Our vision is to become a trusted and innovative
                  transportation solution that transforms the commuting
                  experience through smart technology. BUSahero envisions a
                  future where every commuter has access to accurate,
                  real-time transportation information, enabling safer,
                  faster, and more convenient travel while supporting the
                  modernization of public transportation systems in the
                  Philippines.
                </p>
              </div>

              <div className="info-hero-illustration" aria-hidden="true">
                👁️
              </div>
            </div>

            <div className="info-grid cols-5" style={{ marginTop: 14 }}>
              {visionGoals.map((g) => (
                <div className="info-tile" key={g.title}>
                  <span className="icon-badge">{g.icon}</span>
                  <div className="info-tile-title">{g.title}</div>
                  <div className="info-tile-body">{g.body}</div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="info-subheading underline">Contact</div>

            <div
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 18,
                padding: 22,
                alignItems: "flex-start",
              }}
            >
              <span className="icon-badge lg">✉️</span>
              <div>
                <div className="info-card-title">Get in Touch</div>
                <p className="info-card-body">
                  For questions, feedback, or concerns about BUSahero, reach
                  out to the development team.
                </p>
                <p className="info-card-body" style={{ marginTop: 8 }}>
                  Email:{" "}
                  <a href="mailto:BusaHero.inc@gmail.com" style={{ color: "var(--blue-600)", fontWeight: 600 }}>
                    BusaHero.inc@gmail.com
                  </a>
                  <br />
                  University: President Ramon Magsaysay State University,
                  Iba, Zambales, Philippines
                </p>
              </div>
            </div>

            <div className="info-subheading">Meet the Developers</div>
            <div className="team-grid">
              {developers.map((dev, i) => (
                <TeamCard key={dev.name} dev={dev} index={i + 1} />
              ))}
            </div>

            <div className="info-subheading">Thesis Adviser</div>
            <div className="team-grid">
              <TeamCard dev={adviser} index={1} />
            </div>

            <div className="info-subheading">Academic Information</div>
            <div className="info-fact-grid">
              <div className="info-fact">
                <span className="icon-badge">🎓</span>
                <div>
                  <div className="info-fact-title">University</div>
                  <div className="info-fact-body">
                    President Ramon Magsaysay State University
                    <br />
                    Iba, Zambales, Philippines
                  </div>
                </div>
              </div>

              <div className="info-fact">
                <span className="icon-badge">📖</span>
                <div>
                  <div className="info-fact-title">Program</div>
                  <div className="info-fact-body">
                    Bachelor of Science in Computer Science
                    <br />
                    College of Communication and Information Technology
                  </div>
                </div>
              </div>

              <div className="info-fact">
                <span className="icon-badge">📅</span>
                <div>
                  <div className="info-fact-title">Version</div>
                  <div className="info-fact-body">
                    © 2026 BUSahero
                    <br />
                    All Rights Reserved. Version 1.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
