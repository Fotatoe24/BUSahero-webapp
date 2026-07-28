"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import FareTable from "@/components/FareTable";
import FareModal from "@/components/FareModal";
import FareCalculator from "@/components/fareCalculator";

import { useToast } from "@/components/Toast";
import { useFares } from "@/lib/useFares";
import { useRealtimeBuses } from "@/lib/useRealtimeBuses";
import {
  getRegularFare,
  getDiscountedFare,
  formatPeso,
} from "@/lib/fareCalculator";

export default function FaresPage() {
  const { fares, loading, addFare, updateFare, deleteFare, source } =
    useFares();

  const { buses } = useRealtimeBuses();

  const { showToast, Toast } = useToast();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const editingFare = editingId ? fares.find((f) => f.id === editingId) : null;

  function openNew() {
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(id: string) {
    setEditingId(id);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
  }

  async function handleSave(values: { route: string; distanceKm: string }) {
    if (editingId) {
      await updateFare(editingId, values);

      showToast("Fare updated");
    } else {
      await addFare(values);

      showToast("Fare added");
    }

    closeModal();
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm("Delete this fare? This cannot be undone.");

    if (!confirmDelete) return;

    await deleteFare(id);

    showToast("Fare deleted");

    closeModal();
  }

  const avgRegular = fares.length
    ? Math.round(
        fares.reduce((sum, fare) => sum + getRegularFare(fare.distanceKm), 0) /
          fares.length
      )
    : 0;

  const avgDiscounted = fares.length
    ? Math.round(
        fares.reduce(
          (sum, fare) => sum + getDiscountedFare(fare.distanceKm),
          0
        ) / fares.length
      )
    : 0;

  return (
    <div className="shell">
      <Sidebar />

      <div className="main">
        <Topbar
          title="Fares"
          subtitle="Route pricing and discounts"
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
              label="Routes priced"
              value={fares.length}
              foot="fare rules configured"
            />

            <StatCard
              label="Avg. regular fare"
              value={formatPeso(avgRegular)}
            />

            <StatCard
              label="Avg. discounted fare"
              value={formatPeso(avgDiscounted)}
            />
          </div>

          <FareCalculator />

          <div className="card">
            <div className="card-head">
              <div>
                <div className="section-title">Fares</div>

                <div className="section-sub">
                  Fares are computed from route distance per the LTFRB fare
                  guide
                </div>
              </div>

              <button className="btn btn-primary" onClick={openNew}>
                + New Fare
              </button>
            </div>

            <FareTable fares={fares} loading={loading} onEdit={openEdit} />
          </div>
        </div>
      </div>

      <FareModal
        open={modalOpen}
        fare={editingFare}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <Toast />
    </div>
  );
}
