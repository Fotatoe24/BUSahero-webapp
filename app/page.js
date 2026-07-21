"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import BusStatusList from "@/components/BusStatusList";
import { useRealtimeBuses } from "@/lib/useRealtimeBuses";
import { useFares } from "@/lib/useFares";

// Placeholder average daily trips per active bus, used only to give the
// "estimated revenue" metric something to work with until real trip/ticket
// counts are wired up from your ticketing data.
const ASSUMED_TRIPS_PER_BUS_PER_DAY = 6;
const ASSUMED_PASSENGERS_PER_TRIP = 18;

export default function DashboardPage() {
  const { buses, loading: busesLoading, source: busSource } = useRealtimeBuses();
  const { fares, loading: faresLoading } = useFares();

  const activeBuses = buses.length;
  const movingBuses = buses.filter((b) => (b.speed ?? 0) > 0).length;
  const avgSatellites = buses.length
    ? (buses.reduce((sum, b) => sum + (b.satellites ?? 0), 0) / buses.length).toFixed(1)
    : "—";

  const avgRegularFare = fares.length
    ? Math.round(fares.reduce((sum, f) => sum + (f.regular ?? 0), 0) / fares.length)
    : 0;

  const estimatedDailyRevenue = Math.round(
    activeBuses * ASSUMED_TRIPS_PER_BUS_PER_DAY * ASSUMED_PASSENGERS_PER_TRIP * avgRegularFare
  );

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar
          title="Dashboard"
          subtitle="Realtime fleet overview and fare metrics"
          source={busSource}
        />
        <div className="content">
          <div className="stat-grid">
            <StatCard label="Active buses" value={busesLoading ? "…" : activeBuses} foot="reporting a GPS position" />
            <StatCard
              label="Currently moving"
              value={busesLoading ? "…" : movingBuses}
              foot={`${activeBuses - movingBuses || 0} stopped`}
              footTone="up"
            />
            <StatCard label="Routes with fares set" value={faresLoading ? "…" : fares.length} foot="configured by operator" />
            <StatCard
              label="Avg. regular fare"
              value={faresLoading ? "…" : `₱${avgRegularFare}`}
              foot="across all routes"
            />
          </div>

          <div className="dash-grid">
            <div className="card">
              <div className="card-head">
                <div>
                  <div className="section-title">Live bus positions</div>
                  <div className="section-sub">
                    From Firebase Realtime Database (<span className="mono">/buses</span>)
                  </div>
                </div>
              </div>
              <BusStatusList buses={buses} loading={busesLoading} />
            </div>

            <div className="card">
              <div className="card-head">
                <div>
                  <div className="section-title">Fare metrics</div>
                  <div className="section-sub">Estimated from configured fares</div>
                </div>
              </div>
              <div style={{ padding: 18 }}>
                <StatCard
                  label="Estimated daily revenue"
                  value={`₱${estimatedDailyRevenue.toLocaleString()}`}
                  foot={`assumes ${ASSUMED_TRIPS_PER_BUS_PER_DAY} trips/bus · ${ASSUMED_PASSENGERS_PER_TRIP} riders/trip`}
                  footTone="warn"
                />
                <div style={{ marginTop: 14 }}>
                  <div className="section-sub" style={{ marginBottom: 8 }}>
                    Avg. satellite lock across fleet
                  </div>
                  <div className="stat-value" style={{ fontSize: 20 }}>
                    {avgSatellites} sats
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
