"use client";

import { useMemo, useState } from "react";
import { getFareBreakdown, formatPeso } from "@/lib/fareCalculator";
import { useFareSettings } from "@/lib/useFareSettings";
import {
  TOWN_ROUTES,
  getRouteLabel,
  getDistanceBetween,
} from "@/lib/routeDistances";

// Group the flat 88-stop TOWN_ROUTES list by municipality, in the order
// municipalities first appear (which is already Olongapo -> Santa Cruz
// since TOWN_ROUTES is derived from ZAMBALES_CORRIDOR).
function groupByMunicipality(routes: typeof TOWN_ROUTES) {
  const order: string[] = [];
  const groups = new Map<string, typeof TOWN_ROUTES>();

  for (const route of routes) {
    if (!groups.has(route.municipality)) {
      groups.set(route.municipality, []);
      order.push(route.municipality);
    }
    groups.get(route.municipality)!.push(route);
  }

  return order.map((municipality) => ({
    municipality,
    stops: groups.get(municipality)!,
  }));
}

export default function FareCalculator() {
  const { settings, loading: settingsLoading } = useFareSettings();

  const groupedStops = useMemo(() => groupByMunicipality(TOWN_ROUTES), []);

  const [fromId, setFromId] = useState<string>(TOWN_ROUTES[0]?.id ?? "");

  const [toId, setToId] = useState<string>(
    TOWN_ROUTES[TOWN_ROUTES.length - 1]?.id ?? TOWN_ROUTES[0]?.id ?? ""
  );

  const [manualDistance, setManualDistance] = useState<string | null>(null);

  const fromTown = useMemo(
    () => TOWN_ROUTES.find((r) => r.id === fromId),
    [fromId]
  );

  const toTown = useMemo(() => TOWN_ROUTES.find((r) => r.id === toId), [toId]);

  const computedDistance = getDistanceBetween(fromId, toId);

  const distanceKm =
    manualDistance !== null ? Number(manualDistance) : computedDistance;

  const isSameTown = fromId === toId;
  const hasValidDistance = !isSameTown && distanceKm > 0;

  const breakdown =
    hasValidDistance && !settingsLoading
      ? getFareBreakdown(distanceKm, settings)
      : null;

  function handleFromChange(id: string) {
    setFromId(id);
    setManualDistance(null);
  }

  function handleToChange(id: string) {
    setToId(id);
    setManualDistance(null);
  }

  function handleSwap() {
    setFromId(toId);
    setToId(fromId);
    setManualDistance(null);
  }

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-head">
        <div>
          <div className="section-title">Fare Matrix</div>

          <div className="section-sub">
            {settingsLoading
              ? "Loading fare settings…"
              : `₱${settings.baseFare.toFixed(2)} first ${
                  settings.baseDistanceKm
                } km · +₱${settings.perKmRate.toFixed(2)}/km after`}
          </div>
        </div>
      </div>

      <div style={{ padding: 18 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 10,
            alignItems: "end",
            marginBottom: 14,
          }}
        >
          <div>
            <label className="field-label" htmlFor="calcFrom">
              From
            </label>

            <select
              id="calcFrom"
              className="text-input"
              style={{ marginBottom: 0 }}
              value={fromId}
              onChange={(e) => handleFromChange(e.target.value)}
            >
              {groupedStops.map((group) => (
                <optgroup key={group.municipality} label={group.municipality}>
                  {group.stops.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.town}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="row-btn"
            title="Swap From and To"
            onClick={handleSwap}
            style={{ marginBottom: 0 }}
          >
            ⇄
          </button>

          <div>
            <label className="field-label" htmlFor="calcTo">
              To
            </label>

            <select
              id="calcTo"
              className="text-input"
              style={{ marginBottom: 0 }}
              value={toId}
              onChange={(e) => handleToChange(e.target.value)}
            >
              {groupedStops.map((group) => (
                <optgroup key={group.municipality} label={group.municipality}>
                  {group.stops.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.town}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
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
            onChange={(e) => setManualDistance(e.target.value)}
          />
        </div>

        {isSameTown ? (
          <div className="section-sub" style={{ marginBottom: 14 }}>
            Select two different stops to calculate a fare.
          </div>
        ) : (
          fromTown &&
          toTown && (
            <div className="section-sub" style={{ marginBottom: 14 }}>
              {getRouteLabel(fromTown.town, toTown.town)}
            </div>
          )
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
      </div>
    </div>
  );
}
