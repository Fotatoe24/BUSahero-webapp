"use client";

import { useEffect, useState } from "react";
import { FareSettings } from "@/types/fareSettings";

interface FareSettingsModalProps {
  open: boolean;
  settings: FareSettings;
  onClose: () => void;
  onSave: (values: Omit<FareSettings, "updatedAt">) => void;
}

export default function FareSettingsModal({
  open,
  settings,
  onClose,
  onSave,
}: FareSettingsModalProps) {
  const [baseFare, setBaseFare] = useState<string>("");
  const [baseDistanceKm, setBaseDistanceKm] = useState<string>("");
  const [perKmRate, setPerKmRate] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open) {
      setBaseFare(settings.baseFare.toString());
      setBaseDistanceKm(settings.baseDistanceKm.toString());
      setPerKmRate(settings.perKmRate.toString());
      setDiscountPercent(settings.discountPercent.toString());
      setError("");
    }
  }, [open, settings]);

  if (!open) return null;

  function handleSave() {
    if (
      baseFare === "" ||
      baseDistanceKm === "" ||
      perKmRate === "" ||
      discountPercent === ""
    ) {
      setError("All fields are required.");
      return;
    }

    onSave({
      baseFare: Number(baseFare),
      baseDistanceKm: Number(baseDistanceKm),
      perKmRate: Number(perKmRate),
      discountPercent: Number(discountPercent),
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
          <div className="modal-title">Fare Calculation Settings</div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <label className="field-label" htmlFor="baseFare">
            Base fare (₱) — for first N km
          </label>
          <input
            id="baseFare"
            className="text-input"
            type="number"
            min="0"
            step="0.01"
            value={baseFare}
            onChange={(e) => setBaseFare(e.target.value)}
          />

          <label className="field-label" htmlFor="baseDistanceKm">
            Base distance (km)
          </label>
          <input
            id="baseDistanceKm"
            className="text-input"
            type="number"
            min="0"
            step="0.1"
            value={baseDistanceKm}
            onChange={(e) => setBaseDistanceKm(e.target.value)}
          />

          <label className="field-label" htmlFor="perKmRate">
            Rate per km beyond base distance (₱)
          </label>
          <input
            id="perKmRate"
            className="text-input"
            type="number"
            min="0"
            step="0.01"
            placeholder="2.20"
            value={perKmRate}
            onChange={(e) => setPerKmRate(e.target.value)}
          />

          <label className="field-label" htmlFor="discountPercent">
            Student / Elderly / PWD discount (%)
          </label>
          <input
            id="discountPercent"
            className="text-input"
            type="number"
            min="0"
            max="100"
            step="1"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
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
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
