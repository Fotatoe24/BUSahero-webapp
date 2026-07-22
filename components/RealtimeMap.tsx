"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, Marker } from "maplibre-gl";

import { Bus } from "@/types/bus";

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

interface RealtimeMapProps {
  buses: Bus[];
}

export default function RealtimeMap({ buses }: RealtimeMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});

  // Init the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPTILER_KEY) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
      center: [120.05, 15.05], // Zambales area, matches the old mock positioning
      zoom: 10,
    });

    mapRef.current.addControl(
      new maplibregl.NavigationControl(),
      "bottom-right"
    );

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync bus markers whenever `buses` updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const seen = new Set<string>();

    buses.forEach((bus) => {
      seen.add(bus.id);

      const className = `map-bus-pin ${
        bus.status === "In Transit" ? "moving" : "stopped"
      }`;

      const existing = markersRef.current[bus.id];

      if (existing) {
        existing.setLngLat([bus.longitude, bus.latitude]);
        existing.getElement().className = className;
      } else {
        const el = document.createElement("div");
        el.className = className;
        el.innerHTML = `🚌<span>${bus.id.toUpperCase()}</span>`;

        markersRef.current[bus.id] = new maplibregl.Marker({ element: el })
          .setLngLat([bus.longitude, bus.latitude])
          .addTo(map);
      }
    });

    // Drop markers for buses that dropped off the feed
    Object.keys(markersRef.current).forEach((id) => {
      if (!seen.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
  }, [buses]);

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

      {MAPTILER_KEY ? (
        <div ref={containerRef} className="maptiler-map" />
      ) : (
        <div className="empty-state">
          Add <code>NEXT_PUBLIC_MAPTILER_API_KEY</code> to{" "}
          <code>.env.local</code> to enable the live map.
        </div>
      )}
    </div>
  );
}
