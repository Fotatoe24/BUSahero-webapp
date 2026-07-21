function statusBadge(status) {
  if (status === "In Transit") return <span className="badge badge-green">In Transit</span>;
  if (status === "Stopped") return <span className="badge badge-slate">Stopped</span>;
  if (status === "Delayed") return <span className="badge badge-amber">Delayed</span>;
  return <span className="badge badge-slate">{status}</span>;
}

export default function BusStatusList({ buses, loading }) {
  if (loading) {
    return <div className="empty-state">Connecting to bus feed…</div>;
  }
  if (!buses.length) {
    return <div className="empty-state">No buses reporting a location right now.</div>;
  }
  return (
    <div>
      {buses.map((bus) => (
        <div className="bus-item" key={`${bus.region}-${bus.id}`}>
          <div>
            <div className="bus-id">{bus.id.toUpperCase()}</div>
            <div className="bus-region">{bus.region} region</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="bus-coords">
              {bus.latitude?.toFixed(5)}, {bus.longitude?.toFixed(5)}
            </div>
            <div style={{ marginTop: 4 }}>{statusBadge(bus.status)}</div>
          </div>
          <div style={{ textAlign: "right", minWidth: 90 }}>
            <div className="bus-coords">{bus.speed ?? 0} km/h</div>
            <div className="bus-coords">{bus.satellites ?? 0} sats</div>
          </div>
        </div>
      ))}
    </div>
  );
}
