"use client";

import { useEffect, useRef } from "react";
import L, { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

import { Bus } from "@/types/bus";
import { olongapoToSantaCruzRoute } from "@/lib/routes";

interface RealtimeMapProps {
  buses: Bus[];
}

export default function RealtimeMap({ buses }: RealtimeMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Init the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [15.05, 120.05],
      zoom: 10,
      zoomControl: false,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    routeLayerRef.current = L.polyline(
      olongapoToSantaCruzRoute.map(([lng, lat]) => [lat, lng]),
      {
        color: "#2e5cf0",
        weight: 4,
        opacity: 0.85,
        lineJoin: "round",
        lineCap: "round",
      }
    ).addTo(map);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    resizeObserver.observe(containerRef.current);

    function forceResize() {
      map.invalidateSize();
    }

    let lastWidth = -1;
    let lastHeight = -1;
    let pollFrame: number;
    const pollStartedAt = Date.now();
    const POLL_DURATION_MS = 6000;

    function pollSize() {
      const el = containerRef.current;
      if (el) {
        const { clientWidth, clientHeight } = el;
        if (clientWidth !== lastWidth || clientHeight !== lastHeight) {
          lastWidth = clientWidth;
          lastHeight = clientHeight;
          map.invalidateSize();
        }
      }

      if (Date.now() - pollStartedAt < POLL_DURATION_MS) {
        pollFrame = requestAnimationFrame(pollSize);
      }
    }

    pollFrame = requestAnimationFrame(pollSize);

    window.addEventListener("resize", forceResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", forceResize);
      cancelAnimationFrame(pollFrame);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync bus markers whenever `buses` updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const seen = new Set<string>();

    buses.forEach((bus) => {
      if (!Number.isFinite(bus.latitude) || !Number.isFinite(bus.longitude)) {
        console.warn(`Skipping bus ${bus.id}: invalid coordinates`, bus);
        return;
      }

      const key = `${bus.region}-${bus.id}`;
      seen.add(key);

      const statusClass = bus.status === "In Transit" ? "moving" : "stopped";
      const existing = markersRef.current[key];

      if (existing) {
        existing.setLatLng([bus.latitude, bus.longitude]);

        const el = existing.getElement();
        if (el) {
          el.classList.remove("moving", "stopped");
          el.classList.add(statusClass);
        }
      } else {
        const icon = L.divIcon({
          className: `map-bus-pin ${statusClass}`,
          html: `<span class="map-bus-pin-icon">🚌</span><span class="map-bus-pin-label">${bus.id.toUpperCase()}</span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        markersRef.current[key] = L.marker([bus.latitude, bus.longitude], {
          icon,
        }).addTo(map);
      }
    });

    Object.keys(markersRef.current).forEach((key) => {
      if (!seen.has(key)) {
        markersRef.current[key].remove();
        delete markersRef.current[key];
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

      <div ref={containerRef} className="maptiler-map" />
    </div>
  );
}
