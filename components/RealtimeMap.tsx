"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, Marker } from "maplibre-gl";

import { Bus } from "@/types/bus";
import { olongapoToSantaCruzRoute } from "@/lib/routes";

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
const ROUTE_SOURCE_ID = "corridor-route";
const ROUTE_LAYER_ID = "corridor-route-line";

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

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
      center: [120.05, 15.05],
      zoom: 10,
    });

    mapRef.current = map;

    // TEMP DEBUG — remove after confirming the resize fix. Exposes the map
    // instance so we can call map.resize() directly from devtools console.
    (window as any).__debugMap = map;

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");

    function addRouteLayer() {
      if (map.getSource(ROUTE_SOURCE_ID)) return; // avoid dupes on style reloads

      map.addSource(ROUTE_SOURCE_ID, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: olongapoToSantaCruzRoute,
          },
        },
      });

      map.addLayer({
        id: ROUTE_LAYER_ID,
        type: "line",
        source: ROUTE_SOURCE_ID,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#2e5cf0",
          "line-width": 4,
          "line-opacity": 0.85,
        },
      });
    }

    if (map.isStyleLoaded()) {
      addRouteLayer();
    } else {
      map.on("load", addRouteLayer);
    }

    // MapTiler style swaps can drop custom sources/layers — re-add if that happens
    map.on("styledata", () => {
      if (map.isStyleLoaded() && !map.getSource(ROUTE_SOURCE_ID)) {
        addRouteLayer();
      }
    });

    // Keep the map's internal canvas size in sync with the actual container
    // size. Without this, if the container resizes after init (sidebar,
    // fonts loading, layout shifts), maplibre's projection math goes stale
    // and markers drift further off the further you zoom out — they're
    // computed correctly from lat/lng, but rendered against a canvas sized
    // for the old container dimensions.
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserver.observe(containerRef.current);

    // Resize once the map itself reports it has loaded (tiles + style
    // ready) — belt-and-suspenders alongside the polling below.
    function forceResize() {
      map.resize();
    }

    map.on("load", forceResize);

    // Fixed-delay timers are a guess about when layout finally settles.
    // Instead, actively poll the container's real size against what the
    // map last saw, and resize whenever they disagree — for a window long
    // enough to catch slow settling (webfonts, flex growth from sibling
    // content, AuthGuard's loading-state swap, etc). This can't go stale
    // the way a fixed timeout list can.
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
          map.resize();
        }
      }

      if (Date.now() - pollStartedAt < POLL_DURATION_MS) {
        pollFrame = requestAnimationFrame(pollSize);
      }
    }

    pollFrame = requestAnimationFrame(pollSize);

    // Belt-and-suspenders: browser-level zoom / window resize can change
    // devicePixelRatio and layout in ways that don't always route through
    // the container ResizeObserver in every browser.
    window.addEventListener("resize", forceResize);

    return () => {
      resizeObserver.disconnect();
      map.off("load", forceResize);
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
        existing.setLngLat([bus.longitude, bus.latitude]);

        // IMPORTANT: never do `getElement().className = ...` here. That
        // replaces the ENTIRE class list, including the internal
        // `maplibregl-marker` (+ anchor) classes MapLibre adds at creation
        // time, which carry the `position: absolute` the marker's
        // transform-based positioning depends on. Losing that class lets
        // the element fall into normal document flow, so it slowly drifts
        // away from its true lng/lat — most visible during zoom repaints,
        // which is exactly the symptom being fixed here. Toggle only the
        // status classes instead.
        const el = existing.getElement();
        el.classList.remove("moving", "stopped");
        el.classList.add(statusClass);
      } else {
        const el = document.createElement("div");
        el.className = `map-bus-pin ${statusClass}`;
        el.innerHTML = `<span class="map-bus-pin-icon">🚌</span><span class="map-bus-pin-label">${bus.id.toUpperCase()}</span>`;

        markersRef.current[key] = new maplibregl.Marker({
          element: el,
          // Fix the anchor explicitly instead of letting MapLibre infer it
          // from the element's rendered size — that inference is what was
          // causing the pin to appear to grow/shrink and drift during zoom.
          anchor: "bottom",
          // Marker DOM elements are always screen-space (pixel) sized and
          // never scale with zoom by design; pinning rotation/pitch
          // alignment to the viewport makes that explicit so a future
          // tilt/bearing change can't affect it either.
          rotationAlignment: "viewport",
          pitchAlignment: "viewport",
        })
          .setLngLat([bus.longitude, bus.latitude])
          .addTo(map);
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
