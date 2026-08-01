"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import FareTable from "@/components/FareTable";
import FareSettingsModal from "@/components/FareSettingsModal";
import FareCalculator from "@/components/FareCalculator";

import { useToast } from "@/components/Toast";
import { useFareSettings } from "@/lib/useFareSettings";
import { useRealtimeBuses } from "@/lib/useRealtimeBuses";
import { calculateFare } from "@/lib/fareCalculator";

export default function FaresPage() {
  const { settings, loading, updateSettings, source } = useFareSettings();
  const { buses } = useRealtimeBuses();
  const { showToast, Toast } = useToast();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  async function handleSave(values: {
    baseFare: number;
    baseDistanceKm: number;
    perKmRate: number;
    discountPercent: number;
  }) {
    await updateSettings(values);
    showToast("Fare calculation updated");
    setModalOpen(false);
  }

  const sample10kmFare = calculateFare(10, settings, false);

  return (
    <div className="shell">
      <Sidebar />

      <div className="main">
        <Topbar
          title="Fares"
          subtitle="Distance-based fare calculation"
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
              label="Base fare"
              value={`₱${settings.baseFare.toFixed(2)}`}
              foot={`first ${settings.baseDistanceKm} km`}
            />
            <StatCard
              label="Rate per km"
              value={`₱${settings.perKmRate.toFixed(2)}`}
              foot="beyond base distance"
            />
            <StatCard
              label="10 km fare"
              value={`₱${sample10kmFare.toFixed(2)}`}
              foot="sample calculation"
            />
          </div>

          {/* Fare Calculator */}
          <FareCalculator />

          <div className="card">
            <div className="card-head">
              <div>
                <div className="section-title">Fare Calculation</div>
                <div className="section-sub">
                  All fares are computed from this formula — no per-route
                  pricing
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setModalOpen(true)}
              >
                Edit Fare Calculation
              </button>
            </div>

            <FareTable settings={settings} loading={loading} />
          </div>
        </div>
      </div>

      <FareSettingsModal
        open={modalOpen}
        settings={settings}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <Toast />
    </div>
  );
}
