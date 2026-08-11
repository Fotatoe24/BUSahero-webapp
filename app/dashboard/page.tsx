"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import BusStatusList from "@/components/BusStatusList";
import dynamic from "next/dynamic";
import AuthGuard from "@/components/AuthGuard";
import { useRealtimeBuses } from "@/lib/useRealtimeBuses";

const RealtimeMap = dynamic(() => import("@/components/RealtimeMap"), {
  ssr: false,
});

export default function DashboardPage() {
  const { buses, loading, source } = useRealtimeBuses();

  return (
    <AuthGuard>
      <div className="shell">
        <Sidebar />

        <div className="main">
          <Topbar
            title="Dashboard"
            subtitle="Real-time bus monitoring"
            source={source === "firebase" ? "firebase" : "mock"}
          />

          <div className="content">
            <div className="stat-grid">
              <StatCard
                label="Active buses"
                value={buses.length}
                foot="currently tracked"
              />

              <StatCard
                label="In transit"
                value={
                  buses.filter((bus) => bus.status === "In Transit").length
                }
              />

              <StatCard
                label="Stopped"
                value={buses.filter((bus) => bus.status === "Stopped").length}
              />
            </div>

            <RealtimeMap buses={buses} />

            <div className="card">
              <div className="card-head">
                <div>
                  <div className="section-title">Bus Status</div>
                  <div className="section-sub">Live GPS monitoring</div>
                </div>
              </div>

              <BusStatusList buses={buses} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
