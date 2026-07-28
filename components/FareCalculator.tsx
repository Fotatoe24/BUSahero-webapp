"use client";

import { useState } from "react";
import { getFareBreakdown, formatPeso } from "@/lib/fareCalculator";

const QUICK_DISTANCES = [5, 15, 40, 75, 150, 300];

export default function FareCalculator() {
  const [distanceKm, setDistanceKm] = useState<string>("15");

  const distanceValue = Number(distanceKm);
  const hasValidDistance = distanceKm !== "" && distanceValue > 0;

  const breakdown = hasValidDistance ? getFareBreakdown(distanceValue) : null;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-head">
        <div>
          <div className="section-title">Fare Calculator</div>

          <div className="section-sub">
            LTFRB fare guide · ₱12.00 first 5 km, +₱2.20/km after
          </div>
        </div>
      </div>

      <div style={{ padding: 18 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 14,
            alignItems: "end",
          }}
        >
          <div>
            <label className="field-label" htmlFor="calcDistance">
              Distance (km)
            </label>

            <input
              id="calcDistance"
              className="text-input"
              type="number"
              min="0"
              step="0.1"
              style={{ marginBottom: 0 }}
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
            />
          </div>

          <div
            style={{
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--ink-500)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Regular fare
            </div>

            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 20,
                marginTop: 2,
              }}
            >
              {breakdown ? formatPeso(breakdown.regular) : "—"}
            </div>
          </div>

          <div
            style={{
              background: "var(--route-green-bg)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--route-green)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Student / Elderly / PWD
            </div>

            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 20,
                marginTop: 2,
                color: "var(--route-green)",
              }}
            >
              {breakdown ? formatPeso(breakdown.discounted) : "—"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 14,
          }}
        >
          {QUICK_DISTANCES.map((km) => (
            <button
              key={km}
              className="btn btn-ghost"
              style={{ padding: "6px 12px", fontSize: 12.5 }}
              onClick={() => setDistanceKm(km.toString())}
            >
              {km} km
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
