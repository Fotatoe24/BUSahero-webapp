"use client";

import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";

interface Developer {
  name: string;
  role: string;
  photo: string;
}

const developers: Developer[] = [
  {
    name: "Louis Phillip Falaminiano",
    role: "Web developer, UX/UI, Database Administrator, and System Analyst",
    photo: "/team/phillip.png",
  },
  {
    name: "Angelica Aquino",
    role: "Financial manager",
    photo: "/team/angelica.png",
  },
  {
    name: "Krizia Mae F. Funiestas",
    role: "Mobile App Developer, system tester",
    photo: "/team/krizia.png",
  },
  {
    name: "Daisy Ann M. Magno",
    role: "Masters in pancit canton cooking, Bank 🤑",
    photo: "/team/daisy_ann.png",
  },
  {
    name: "Rhonielyn Mhei B. Tolentino",
    role: "System alis/ always missing youu!!!!",
    photo: "/team/rhonielyn.png",
  },
];

const adviser: Developer = {
  name: "Rowela Gongora, MCS",
  role: "Thesis Adviser",
  photo: "/team/rowela.png",
};

function TeamCard({ dev }: { dev: Developer }) {
  return (
    <div className="team-card">
      <div className="team-avatar">
        <Image src={dev.photo} alt={dev.name} width={84} height={84} />
      </div>
      <div className="team-name">{dev.name}</div>
      <div className="team-role">{dev.role}</div>
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
            <div className="info-hero">
              <div>
                <div className="section-title" style={{ marginBottom: 10 }}>
                  About the Application
                </div>
                <p className="info-card-body">
                  BUSahero is a web-based real-time bus tracking and arrival
                  estimation application developed to help commuters monitor bus
                  locations, estimate arrival times, check seat availability,
                  and calculate fares for trips between Olongapo City and
                  Zambales.
                </p>
              </div>

              <div className="info-hero-illustration" aria-hidden="true">
                <Image
                  src="/busahero-illustration.png"
                  alt="Bus Illustration"
                  width={400}
                  height={240}
                />
              </div>
            </div>

            <div className="info-subheading">Meet the Developers</div>
            <div className="team-grid">
              {developers.map((dev) => (
                <TeamCard key={dev.name} dev={dev} />
              ))}
            </div>

            <div className="info-subheading">Thesis Adviser</div>
            <div className="team-grid">
              <TeamCard dev={adviser} />
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
