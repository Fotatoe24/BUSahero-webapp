"use client";

import { Fare } from "@/types/fare";

interface FareTableProps {
  fares: Fare[];
  loading: boolean;
  onEdit: (id: string) => void;
}

export default function FareTable({ fares, loading, onEdit }: FareTableProps) {
  if (loading) {
    return <div className="empty-state">Loading fares…</div>;
  }

  if (!fares.length) {
    return (
      <div className="empty-state">
        No fares configured yet. Add your first route fare.
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Regular fare</th>
          <th>Student / senior fare</th>
          <th>Last updated</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {fares.map((fare) => (
          <tr key={fare.id}>
            <td className="pname">{fare.route}</td>

            <td className="mono">₱{fare.regular}</td>

            <td className="mono">₱{fare.discounted}</td>

            <td className="mono">
              {new Date(fare.updatedAt).toLocaleDateString()}
            </td>

            <td>
              <button
                className="row-btn"
                title="Edit fare"
                onClick={() => onEdit(fare.id)}
              >
                ✎
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
