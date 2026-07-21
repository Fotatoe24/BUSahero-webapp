"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import BusStatusList from "@/components/BusStatusList";
import RealtimeMap from "@/components/RealtimeMap";

import { useRealtimeBuses } from "@/lib/useRealtimeBuses";

export default function DashboardPage() {
  const { buses, loading, source } = useRealtimeBuses();

  return (
    <div className="shell">
      <Sidebar />

      <div className="main">
        <Topbar
          title="Dashboard"
          subtitle="Real-time bus monitoring"
          source={source === "firebase" ? "firebase" : "mock"}
        />

        <div className="content">
          {/* Statistics */}
          <div className="stat-grid">
            <StatCard
              label="Active buses"
              value={buses.length}
              foot="currently tracked"
            />

            <StatCard
              label="In transit"
              value={buses.filter((bus) => bus.status === "In Transit").length}
            />

            <StatCard
              label="Stopped"
              value={buses.filter((bus) => bus.status === "Stopped").length}
            />

            <StatCard
              label="Delayed"
              value={buses.filter((bus) => bus.status === "Delayed").length}
            />
          </div>

          {/* Mock Realtime Map */}
          <RealtimeMap buses={buses} />

          {/* Bus List */}
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
  );
}
