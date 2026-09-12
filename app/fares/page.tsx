"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import FareTable from "@/components/FareTable";
import FareSettingsModal from "@/components/FareSettingsModal";
import FareMatrixCalculator from "@/components/FareMatrixCalculator";

import { useToast } from "@/components/Toast";
import { useFareSettings } from "@/lib/useFareSettings";
import { useRealtimeBuses } from "@/lib/useRealtimeBuses";
import { calculateFare } from "@/lib/fareCalculator";
import { isBusActive } from "@/lib/busStatus";

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
              value={buses.filter((bus) => isBusActive(bus.status)).length}
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

          {/* Fare Matrix Calculator */}
          <FareMatrixCalculator />

          <div className="card">
            <div className="card-head">
              <div>
                <div className="section-title">Fare Matrix</div>
                <div className="section-sub">
                  Fare per stop along the Olongapo ↔ Santa Cruz corridor,
                  computed from the formula below
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setModalOpen(true)}
              >
                Edit Fare Matrix
              </button>
            </div>

            <div className="fare-matrix-table-scroll">
              <FareTable settings={settings} loading={loading} />
            </div>
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
