"use client";

import { useEffect, useState } from "react";

interface BusInfoModalBus {
  id: string;
  region: string;
  driverName?: string;
  plateNum?: string;
}

interface BusInfoModalProps {
  open: boolean;
  bus?: BusInfoModalBus | null;
  onClose: () => void;
  onSave: (values: { driverName: string; plateNum: string }) => void;
}

export default function BusInfoModal({
  open,
  bus,
  onClose,
  onSave,
}: BusInfoModalProps) {
  const [driverName, setDriverName] = useState<string>("");
  const [plateNum, setPlateNum] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open) {
      setDriverName(bus?.driverName ?? "");
      setPlateNum(bus?.plateNum ?? "");
      setError("");
    }
  }, [open, bus]);

  if (!open || !bus) return null;

  function handleSave() {
    if (!driverName.trim() || !plateNum.trim()) {
      setError("Driver name and plate number are required.");
      return;
    }

    onSave({
      driverName: driverName.trim(),
      plateNum: plateNum.trim(),
    });
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">Edit {bus.id.toUpperCase()}</div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <label className="field-label" htmlFor="driverName">
            Driver name
          </label>

          <input
            id="driverName"
            className="text-input"
            placeholder="e.g. Juan Dela Cruz"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
          />

          <label className="field-label" htmlFor="plateNum">
            Plate number
          </label>

          <input
            id="plateNum"
            className="text-input"
            placeholder="e.g. ABC123"
            value={plateNum}
            onChange={(e) => setPlateNum(e.target.value)}
          />

          <div className={`form-error ${error ? "show" : ""}`}>{error}</div>
        </div>

        <div className="modal-foot">
          <span />

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
