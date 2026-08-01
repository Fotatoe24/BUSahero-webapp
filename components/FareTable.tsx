"use client";

import { FareSettings } from "@/types/fareSettings";
import { calculateFare } from "@/lib/fareCalculator";

interface FareTableProps {
  settings: FareSettings;
  loading: boolean;
}

const PREVIEW_DISTANCES = [2, 5, 10, 15, 20, 25, 30];

export default function FareTable({ settings, loading }: FareTableProps) {
  if (loading) {
    return <div className="empty-state">Loading fare settings…</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Distance</th>
          <th>Regular fare</th>
          <th>Discounted fare</th>
        </tr>
      </thead>

      <tbody>
        {PREVIEW_DISTANCES.map((km) => (
          <tr key={km}>
            <td className="pname">{km} km</td>
            <td className="mono">
              ₱{calculateFare(km, settings, false).toFixed(2)}
            </td>
            <td className="mono">
              ₱{calculateFare(km, settings, true).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
