"use client";

import { useEffect, useState } from "react";

export default function FareModal({ open, fare, onClose, onSave, onDelete }) {
  const [route, setRoute] = useState("");
  const [regular, setRegular] = useState("");
  const [discounted, setDiscounted] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setRoute(fare?.route ?? "");
      setRegular(fare?.regular ?? "");
      setDiscounted(fare?.discounted ?? "");
      setError("");
    }
  }, [open, fare]);

  if (!open) return null;

  const isEditing = !!fare;

  function handleSave() {
    if (!route.trim() || regular === "" || discounted === "") {
      setError("Route and both fares are required.");
      return;
    }
    onSave({ route: route.trim(), regular, discounted });
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
          <div className="modal-title">{isEditing ? "Edit Fare" : "New Fare"}</div>
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

          <label className="field-label" htmlFor="fareRegular">
            Regular fare (₱)
          </label>
          <input
            id="fareRegular"
            className="text-input"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={regular}
            onChange={(e) => setRegular(e.target.value)}
          />

          <label className="field-label" htmlFor="fareDiscounted">
            Student / senior fare (₱)
          </label>
          <input
            id="fareDiscounted"
            className="text-input"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={discounted}
            onChange={(e) => setDiscounted(e.target.value)}
          />

          <div className={`form-error ${error ? "show" : ""}`}>{error}</div>
        </div>
        <div className="modal-foot">
          {isEditing ? (
            <button className="btn btn-danger-outline" onClick={() => onDelete(fare.id)}>
              Delete Fare
            </button>
          ) : (
            <span />
          )}
          <div style={{ display: "flex", gap: 8 }}>
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
