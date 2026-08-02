"use client";

interface BusInfoRow {
  id: string;
  region: string;
  driverName?: string;
  plateNum?: string;
  busName?: string;
  status: string;
  speed?: number;
}

interface BusInfoTableProps {
  buses: BusInfoRow[];
  loading: boolean;
  onEdit: (region: string, id: string) => void;
}

function statusBadge(status: string) {
  if (status === "In Transit") {
    return <span className="badge badge-green">In Transit</span>;
  }

  if (status === "Stopped") {
    return <span className="badge badge-slate">Stopped</span>;
  }

  if (status === "Delayed") {
    return <span className="badge badge-amber">Delayed</span>;
  }

  return <span className="badge badge-slate">{status}</span>;
}

export default function BusInfoTable({
  buses,
  loading,
  onEdit,
}: BusInfoTableProps) {
  if (loading) {
    return <div className="empty-state">Loading bus info…</div>;
  }

  if (!buses.length) {
    return <div className="empty-state">No buses reporting right now.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Bus ID</th>
          <th>Bus Name</th>
          <th>Region</th>
          <th>Driver</th>
          <th>Plate Number</th>
          <th>Status</th>
          <th>Speed</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {buses.map((bus) => (
          <tr key={`${bus.region}-${bus.id}`}>
            <td className="pname">{bus.id.toUpperCase()}</td>

            <td>{bus.busName || "—"}</td>

            <td style={{ textTransform: "capitalize" }}>{bus.region}</td>

            <td>{bus.driverName || "—"}</td>

            <td className="mono">{bus.plateNum || "—"}</td>

            <td>{statusBadge(bus.status)}</td>

            <td className="mono">{bus.speed ?? 0} km/h</td>

            <td>
              <button
                className="row-btn"
                title="Edit bus info"
                onClick={() => onEdit(bus.region, bus.id)}
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
