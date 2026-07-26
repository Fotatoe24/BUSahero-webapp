"use client";

import { useEffect, useState } from "react";
import { BusInfo } from "@/types/busInfo";

interface BusInfoModalProps {
  open: boolean;
  busInfo?: BusInfo | null;
  onClose: () => void;
  onSave: (values: {
    busNumber: string;
    plateNumber: string;
    driverName: string;
    route?: string;
  }) => void;
  onDelete: (id: string) => void;
}

export default function BusInfoModal({
  open,
  busInfo,
  onClose,
  onSave,
  onDelete,
}: BusInfoModalProps) {
  const [busNumber, setBusNumber] = useState<string>("");
  const [plateNumber, setPlateNumber] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [route, setRoute] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open) {
      setBusNumber(busInfo?.busNumber ?? "");
      setPlateNumber(busInfo?.plateNumber ?? "");
      setDriverName(busInfo?.driverName ?? "");
      setRoute(busInfo?.route ?? "");
      setError("");
    }
  }, [open, busInfo]);

  if (!open) return null;

  const isEditing = Boolean(busInfo);

  function handleSave() {
    if (!busNumber.trim() || !plateNumber.trim() || !driverName.trim()) {
      setError("Bus number, plate number, and driver name are required.");
      return;
    }

    onSave({
      busNumber: busNumber.trim(),
      plateNumber: plateNumber.trim(),
      driverName: driverName.trim(),
      route: route.trim() || undefined,
    });
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">
            {isEditing ? "Edit Bus" : "New Bus"}
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <label className="field-label" htmlFor="busNumber">
            Bus Number
          </label>

          <input
            id="busNumber"
            className="text-input"
            placeholder="e.g. BUS-01"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
          />

          <label className="field-label" htmlFor="plateNumber">
            Plate Number
          </label>

          <input
            id="plateNumber"
            className="text-input"
            placeholder="e.g. ABC 1234"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
          />

          <label className="field-label" htmlFor="driverName">
            Driver Name
          </label>

          <input
            id="driverName"
            className="text-input"
            placeholder="e.g. Rosa Santos"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
          />

          <label className="field-label" htmlFor="busRoute">
            Route <span style={{ fontWeight: 400 }}>(optional)</span>
          </label>

          <input
            id="busRoute"
            className="text-input"
            placeholder="e.g. Olongapo → Iba"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
          />

          <div className={`form-error ${error ? "show" : ""}`}>{error}</div>
        </div>

        <div className="modal-foot">
          {isEditing ? (
            <button
              className="btn btn-danger-outline"
              onClick={() => onDelete(busInfo!.id)}
            >
              Delete Bus
            </button>
          ) : (
            <span />
          )}

          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-primary" onClick={handleSave}>
              Save Bus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
