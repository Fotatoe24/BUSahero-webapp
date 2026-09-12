"use client";

import { Fragment } from "react";
import { FareSettings } from "@/types/fareSettings";
import { calculateFare } from "@/lib/fareCalculator";
import { ZAMBALES_CORRIDOR } from "@/lib/routeDistances";

interface FareTableProps {
  settings: FareSettings;
  loading: boolean;
}

export default function FareTable({ settings, loading }: FareTableProps) {
  if (loading) {
    return <div className="empty-state">Loading fare settings…</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Stop</th>
          <th>Distance from Olongapo</th>
          <th>Regular fare</th>
          <th>Discounted fare</th>
        </tr>
      </thead>

      <tbody>
        {ZAMBALES_CORRIDOR.map((stop, i) => {
          const prevMunicipality = ZAMBALES_CORRIDOR[i - 1]?.municipality;
          const isNewMunicipality = stop.municipality !== prevMunicipality;

          return (
            <Fragment key={stop.id}>
              {isNewMunicipality && (
                <tr key={`${stop.municipality}-header`}>
                  <td
                    colSpan={4}
                    style={{
                      background: "var(--paper)",
                      fontWeight: 700,
                      fontSize: 11.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: "var(--ink-500)",
                    }}
                  >
                    {stop.municipality}
                  </td>
                </tr>
              )}

              <tr>
                <td className="pname">{stop.name}</td>
                <td className="mono">{stop.cumulativeKm} km</td>
                <td className="mono">
                  ₱{calculateFare(stop.cumulativeKm, settings, false).toFixed(2)}
                </td>
                <td className="mono">
                  ₱{calculateFare(stop.cumulativeKm, settings, true).toFixed(2)}
                </td>
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
