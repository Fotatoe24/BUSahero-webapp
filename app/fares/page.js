"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import FareTable from "@/components/FareTable";
import FareModal from "@/components/FareModal";
import { useToast } from "@/components/Toast";
import { useFares } from "@/lib/useFares";
import { useRealtimeBuses } from "@/lib/useRealtimeBuses";

export default function FaresPage() {
  const { fares, loading, addFare, updateFare, deleteFare, source } = useFares();
  const { buses } = useRealtimeBuses();
  const { showToast, Toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const editingFare = editingId ? fares.find((f) => f.id === editingId) : null;

  function openNew() {
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(id) {
    setEditingId(id);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
  }

  async function handleSave(values) {
    if (editingId) {
      await updateFare(editingId, values);
      showToast("Fare updated");
    } else {
      await addFare(values);
      showToast("Fare added");
    }
    closeModal();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this fare? This cannot be undone.")) return;
    await deleteFare(id);
    showToast("Fare deleted");
    closeModal();
  }

  const avgRegular = fares.length
    ? Math.round(fares.reduce((s, f) => s + (f.regular ?? 0), 0) / fares.length)
    : 0;
  const avgDiscounted = fares.length
    ? Math.round(fares.reduce((s, f) => s + (f.discounted ?? 0), 0) / fares.length)
    : 0;

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar title="Fares" subtitle="Route pricing and discounts" source={source === "firebase" ? "firebase" : "mock"} />
        <div className="content">
          <div className="stat-grid">
            <StatCard label="Active buses" value={buses.length} foot="currently tracked" />
            <StatCard label="Routes priced" value={fares.length} foot="fare rules configured" />
            <StatCard label="Avg. regular fare" value={`₱${avgRegular}`} />
            <StatCard label="Avg. discounted fare" value={`₱${avgDiscounted}`} />
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <div className="section-title">Fares</div>
                <div className="section-sub">Set the regular and discounted fare per route</div>
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
