"use client";

import { useEffect, useState } from "react";
import { Fare } from "@/types/fare";
import { getFareBreakdown, formatPeso } from "../lib/fareCalculator";

interface FareModalProps {
  open: boolean;
  fare?: Fare | null;
  onClose: () => void;
  onSave: (values: { route: string; distanceKm: string }) => void;
  onDelete: (id: string) => void;
}

export default function FareModal({
  open,
  fare,
  onClose,
  onSave,
  onDelete,
}: FareModalProps) {
  const [route, setRoute] = useState<string>("");
  const [distanceKm, setDistanceKm] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open) {
      setRoute(fare?.route ?? "");
      setDistanceKm(fare?.distanceKm?.toString() ?? "");
      setError("");
    }
  }, [open, fare]);

  if (!open) return null;

  const isEditing = Boolean(fare);

  const distanceValue = Number(distanceKm);
  const hasValidDistance = distanceKm !== "" && distanceValue > 0;

  const preview = hasValidDistance ? getFareBreakdown(distanceValue) : null;

  function handleSave() {
    if (!route.trim() || !hasValidDistance) {
      setError("Route and a distance greater than 0 km are required.");
      return;
    }

    onSave({
      route: route.trim(),
      distanceKm,
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
            {isEditing ? "Edit Fare" : "New Fare"}
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <label className="field-label" htmlFor="fareRoute">
            Route
          </label>

          <input
            id="fareRoute"
            className="text-input"
            placeholder="e.g. Olongapo → Iba"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
          />

          <label className="field-label" htmlFor="fareDistance">
            Distance (km)
          </label>

          <input
            id="fareDistance"
            className="text-input"
            type="number"
            min="0"
            step="0.1"
            placeholder="0"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
          />

          <div
            style={{
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "12px 14px",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--ink-500)",
                marginBottom: 8,
              }}
            >
              LTFRB fare guide (auto-computed)
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--ink-700)" }}>
                Regular fare
              </span>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: 13.5,
                }}
              >
                {preview ? formatPeso(preview.regular) : "—"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--ink-700)" }}>
                Student / Elderly / PWD
              </span>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: "var(--route-green)",
                }}
              >
                {preview ? formatPeso(preview.discounted) : "—"}
              </span>
            </div>
          </div>

          <div className={`form-error ${error ? "show" : ""}`}>{error}</div>
        </div>

        <div className="modal-foot">
          {isEditing ? (
            <button
              className="btn btn-danger-outline"
              onClick={() => onDelete(fare!.id)}
            >
              Delete Fare
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
              Save Fare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
