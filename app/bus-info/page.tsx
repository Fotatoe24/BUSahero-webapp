"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import BusInfoTable from "@/components/BusInfoTable";
import BusInfoModal from "@/components/BusInfoModal";
import AuthGuard from "@/components/AuthGuard";

import { useToast } from "@/components/Toast";
import { useRealtimeBuses } from "@/lib/useRealtimeBuses";

export default function BusInfoPage() {
  const { buses, loading, source, updateBusInfo } = useRealtimeBuses();
  const { showToast, Toast } = useToast();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingKey, setEditingKey] = useState<{
    region: string;
    id: string;
  } | null>(null);

  const editingBus = editingKey
    ? buses.find(
        (b) => b.region === editingKey.region && b.id === editingKey.id
      )
    : null;

  function openEdit(region: string, id: string) {
    setEditingKey({ region, id });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingKey(null);
  }

  async function handleSave(values: {
    driverName: string;
    plateNum: string;
    busName: string;
  }) {
    if (!editingKey) return;

    await updateBusInfo(editingKey.region, editingKey.id, values);
    showToast("Bus info updated");
    closeModal();
  }

  return (
    <AuthGuard>
      <div className="shell">
        <Sidebar />

        <div className="main">
          <Topbar
            title="Bus Info"
            subtitle="Driver and vehicle details"
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

              <StatCard
                label="Delayed"
                value={buses.filter((bus) => bus.status === "Delayed").length}
              />
            </div>

            <div className="card">
              <div className="card-head">
                <div>
                  <div className="section-title">Bus Info</div>
                  <div className="section-sub">
                    Driver name and plate number per bus
                  </div>
                </div>
              </div>

              <BusInfoTable buses={buses} loading={loading} onEdit={openEdit} />
            </div>
          </div>
        </div>
      </div>

      <BusInfoModal
        open={modalOpen}
        bus={editingBus}
        onClose={closeModal}
        onSave={handleSave}
      />

      <Toast />
    </AuthGuard>
  );
}
