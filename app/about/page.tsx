"use client";

import Link from "next/link";
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

            <div className="info-subheading">Mission &amp; Vision</div>
            <div className="info-grid two-col">
              <div className="info-tile">
                <span className="icon-badge">🚩</span>
                <div className="info-tile-title">Our Mission</div>
                <div className="info-tile-body">
                  To develop a reliable and user-friendly web application
                  that empowers commuters with real-time bus tracking,
                  accurate arrival estimation, and fare computation —
                  improving the daily commuting experience between Olongapo
                  City and Zambales.
                </div>
                <Link
                  href="/mission"
                  className="info-footnote"
                  style={{ display: "inline-block", marginTop: 12 }}
                >
                  Read the full mission →
                </Link>
              </div>

              <div className="info-tile">
                <span className="icon-badge">👁️</span>
                <div className="info-tile-title">Our Vision</div>
                <div className="info-tile-body">
                  To become a trusted and innovative transportation solution
                  that transforms the commuting experience through smart
                  technology, supporting the modernization of public
                  transportation in the Philippines.
                </div>
                <Link
                  href="/vision"
                  className="info-footnote"
                  style={{ display: "inline-block", marginTop: 12 }}
                >
                  Read the full vision →
                </Link>
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
