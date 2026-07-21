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

        {buses.map((bus) => {
          // Convert GPS coordinates into fake map positions
          // Philippines/Zambales area approximation
          const left = ((bus.longitude - 119.8) / 0.5) * 100;

          const top = 100 - ((bus.latitude - 14.8) / 0.7) * 100;

          return (
            <div
              key={bus.id}
              className={`bus-marker ${
                bus.status === "In Transit" ? "moving" : "stopped"
              }`}
              style={{
                left: `${Math.min(Math.max(left, 5), 95)}%`,
                top: `${Math.min(Math.max(top, 5), 95)}%`,
              }}
            >
              🚌
              <span>{bus.id.toUpperCase()}</span>
            </div>
          );
        })}

        <div className="map-controls">
          +
          <br />−
        </div>
      </div>
    </div>
  );
}
