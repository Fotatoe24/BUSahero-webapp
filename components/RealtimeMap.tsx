"use client";

import { Bus } from "@/types/bus";

interface RealtimeMapProps {
  buses: Bus[];
}

export default function RealtimeMap({ buses }: RealtimeMapProps) {
  return (
    <div className="map-card">
      <div className="map-header">
        <div>
          <div className="section-title">Realtime Bus Map</div>

          <div className="section-sub">Live fleet location monitoring</div>
        </div>

        <span className="live-pill">
          <span className="live-dot" />
          LIVE
        </span>
      </div>

      <div className="mock-map">
        <div className="road road-1" />
        <div className="road road-2" />

        {buses.map((bus, index) => (
          <div
            key={bus.id}
            className="bus-marker"
            style={{
              left: `${20 + index * 25}%`,
              top: `${30 + index * 15}%`,
            }}
          >
            🚌
            <span>{bus.id.toUpperCase()}</span>
          </div>
        ))}

        <div className="map-controls">
          +
          <br />−
        </div>
      </div>
    </div>
  );
}
