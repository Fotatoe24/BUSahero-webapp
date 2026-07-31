"use client";

import { useMemo, useState } from "react";
import { getFareBreakdown, formatPeso } from "@/lib/fareCalculator";
import {
  TOWN_ROUTES,
  getRouteLabel,
  findTownRoute,
} from "@/lib/routeDistances";

const CUSTOM_TOWN_ID = "__custom__";

export default function FareCalculator() {
  const [selectedTownId, setSelectedTownId] = useState<string>(
    TOWN_ROUTES[0]?.id ?? CUSTOM_TOWN_ID
  );

  const [distanceKm, setDistanceKm] = useState<string>(
    TOWN_ROUTES[0] ? TOWN_ROUTES[0].distanceKm.toString() : "15"
  );

  const selectedRoute = useMemo(
    () =>
      selectedTownId === CUSTOM_TOWN_ID
        ? undefined
        : findTownRoute(selectedTownId),
    [selectedTownId]
  );

  function handleTownChange(id: string) {
    setSelectedTownId(id);

    if (id !== CUSTOM_TOWN_ID) {
      const route = findTownRoute(id);

      if (route) {
        setDistanceKm(route.distanceKm.toString());
      }
    }
  }

  function handleDistanceChange(value: string) {
    setDistanceKm(value);

    // Manual edits detach the field from whichever town was selected,
    // since the number no longer matches that town's fixed distance.
    setSelectedTownId(CUSTOM_TOWN_ID);
  }

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
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div>
            <label className="field-label" htmlFor="calcTown">
              Destination town
            </label>

            <select
              id="calcTown"
              className="text-input"
              style={{ marginBottom: 0 }}
              value={selectedTownId}
              onChange={(e) => handleTownChange(e.target.value)}
            >
              {TOWN_ROUTES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.town} — {r.distanceKm} km
                </option>
              ))}

              <option value={CUSTOM_TOWN_ID}>Custom distance…</option>
            </select>
          </div>

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
              onChange={(e) => handleDistanceChange(e.target.value)}
            />
          </div>
        </div>

        {selectedRoute && (
          <div className="section-sub" style={{ marginBottom: 14 }}>
            {getRouteLabel(selectedRoute.town)}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            alignItems: "end",
          }}
        >
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
          {TOWN_ROUTES.map((r) => (
            <button
              key={r.id}
              className="btn btn-ghost"
              style={{ padding: "6px 12px", fontSize: 12.5 }}
              onClick={() => handleTownChange(r.id)}
            >
              {r.town}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
