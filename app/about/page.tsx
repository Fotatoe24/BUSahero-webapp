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

// Thesis Adviser is part of the same Developers grid, not a separate section.
const teamMembers: Developer[] = [...developers, adviser];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function TeamCard({ dev }: { dev: Developer }) {
  return (
    <div className="team-card">
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
          <Topbar title="About Us" subtitle="About BUSahero" />

          <div className="content">
            <div className="info-heading">About BUSahero</div>

            {/* About the App */}
            <div className="info-hero">
              <div>
                <div className="info-card-title">About the App</div>
                <p className="info-card-body">
                  BUSahero is a web-based real-time bus tracking and arrival
                  estimation application developed to help commuters monitor bus
                  locations, estimate arrival times, check seat availability,
                  and calculate fares for trips between Olongapo City and
                  Zambales.
                </p>
              </div>

              <div className="info-hero-illustration">
                {/* Placeholder for the About-the-App image. Drop the file at
                    public/about-app.png (or update the src below) — same
                    160px-tall, rounded illustration slot as before, just an
                    image instead of an emoji. */}
                <img
                  src="/busahero-illustration.png"
                  alt="BUSahero app preview"
                  className="info-hero-illustration-img"
                />
              </div>
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
                  For questions, feedback, or concerns about BUSahero, reach out
                  to the development team.
                </p>
                <p className="info-card-body" style={{ marginTop: 8 }}>
                  Email:{" "}
                  <a
                    href="mailto:BusaHero.inc@gmail.com"
                    style={{ color: "var(--blue-600)", fontWeight: 600 }}
                  >
                    BusaHero.inc@gmail.com
                  </a>
                  <br />
                  University: President Ramon Magsaysay State University, Iba,
                  Zambales, Philippines
                </p>
                <p className="info-card-body" style={{ marginTop: 8 }}>
                  <Link
                    href="/terms"
                    style={{ color: "var(--blue-600)", fontWeight: 600 }}
                  >
                    Terms &amp; Conditions
                  </Link>
                  {"  ·  "}
                  <Link
                    href="/privacy-policy"
                    style={{ color: "var(--blue-600)", fontWeight: 600 }}
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            <div className="info-subheading">Meet the Developers</div>
            <div className="team-grid">
              {teamMembers.map((dev) => (
                <TeamCard key={dev.name} dev={dev} />
              ))}
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
