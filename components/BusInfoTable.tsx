"use client";

import { BusInfo } from "@/types/busInfo";

interface BusInfoTableProps {
  busInfo: BusInfo[];
  loading: boolean;
  onEdit: (id: string) => void;
}

export default function BusInfoTable({
  busInfo,
  loading,
  onEdit,
}: BusInfoTableProps) {
  if (loading) {
    return <div className="empty-state">Loading bus info…</div>;
  }

  if (!busInfo.length) {
    return (
      <div className="empty-state">
        No buses registered yet. Add your first bus.
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Bus Number</th>
          <th>Plate Number</th>
          <th>Driver</th>
          <th>Route</th>
          <th>Last updated</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {busInfo.map((info) => (
          <tr key={info.id}>
            <td className="pname">{info.busNumber}</td>

            <td className="mono">{info.plateNumber}</td>

            <td>{info.driverName}</td>

            <td>{info.route ? info.route : "—"}</td>

            <td className="mono">
              {new Date(info.updatedAt).toLocaleDateString()}
            </td>

            <td>
              <button
                className="row-btn"
                title="Edit bus"
                onClick={() => onEdit(info.id)}
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
