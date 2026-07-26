"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import BusInfoTable from "@/components/BusInfoTable";
import BusInfoModal from "@/components/BusInfoModal";

import { useToast } from "@/components/Toast";
import { useBusInfo } from "@/lib/useBusInfo";

export default function BusInfoPage() {
  const { busInfo, loading, addBusInfo, updateBusInfo, deleteBusInfo, source } =
    useBusInfo();

  const { showToast, Toast } = useToast();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const editingBusInfo = editingId
    ? busInfo.find((b) => b.id === editingId)
    : null;

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

  async function handleSave(values: {
    busNumber: string;
    plateNumber: string;
    driverName: string;
    route?: string;
  }) {
    if (editingId) {
      await updateBusInfo(editingId, values);

      showToast("Bus updated");
    } else {
      await addBusInfo(values);

      showToast("Bus added");
    }

    closeModal();
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm("Delete this bus? This cannot be undone.");

    if (!confirmDelete) return;

    await deleteBusInfo(id);

    showToast("Bus deleted");

    closeModal();
  }

  const withRoute = busInfo.filter((b) => Boolean(b.route)).length;

  return (
    <div className="shell">
      <Sidebar />

      <div className="main">
        <Topbar
          title="Bus Info"
          subtitle="Bus, plate, and driver registry"
          source={source === "firebase" ? "firebase" : "mock"}
        />

        <div className="content">
          <div className="stat-grid">
            <StatCard
              label="Registered buses"
              value={busInfo.length}
              foot="in the registry"
            />

            <StatCard
              label="With route assigned"
              value={withRoute}
              foot="of registered buses"
            />
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <div className="section-title">Bus Info</div>

                <div className="section-sub">
                  Bus number, plate number, and assigned driver
                </div>
              </div>

              <button className="btn btn-primary" onClick={openNew}>
                + New Bus
              </button>
            </div>

            <BusInfoTable
              busInfo={busInfo}
              loading={loading}
              onEdit={openEdit}
            />
          </div>
        </div>
      </div>

      <BusInfoModal
        open={modalOpen}
        busInfo={editingBusInfo}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <Toast />
    </div>
  );
}
