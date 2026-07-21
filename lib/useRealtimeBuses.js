"use client";

import { useEffect, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";

// Mirrors the shape of your existing RTDB export:
// buses/{region}/{busId} = { latitude, longitude, satellites, speed, status, updatedAt }
const MOCK_BUSES = {
  north: {
    bus1: {
      latitude: 15.06703,
      longitude: 120.06764,
      satellites: 8,
      speed: 0,
      status: "Stopped",
      updatedAt: Date.now(),
    },
  },
  south: {
    bus2: {
      latitude: 15.31679,
      longitude: 119.98351,
      satellites: 7,
      speed: 0,
      status: "Stopped",
      updatedAt: Date.now(),
    },
  },
};

function flatten(busesByRegion) {
  const out = [];
  Object.entries(busesByRegion || {}).forEach(([region, busesInRegion]) => {
    Object.entries(busesInRegion || {}).forEach(([busId, data]) => {
      out.push({ id: busId, region, ...data });
    });
  });
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

const hasFirebaseConfig = !!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

export function useRealtimeBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(hasFirebaseConfig ? "firebase" : "mock");
  const mockState = useRef(structuredClone(MOCK_BUSES));

  useEffect(() => {
    if (!hasFirebaseConfig) {
      // No Firebase env vars configured yet -- run a lightweight simulation
      // so the dashboard is fully interactive out of the box.
      setBuses(flatten(mockState.current));
      setLoading(false);
      const interval = setInterval(() => {
        Object.values(mockState.current).forEach((region) => {
          Object.values(region).forEach((bus) => {
            const moving = Math.random() > 0.35;
            bus.speed = moving ? Math.round(20 + Math.random() * 40) : 0;
            bus.status = moving ? "In Transit" : "Stopped";
            bus.latitude += moving ? (Math.random() - 0.5) * 0.002 : 0;
            bus.longitude += moving ? (Math.random() - 0.5) * 0.002 : 0;
            bus.satellites = 5 + Math.floor(Math.random() * 5);
            bus.updatedAt = Date.now();
          });
        });
        setBuses(flatten(mockState.current));
      }, 3000);
      return () => clearInterval(interval);
    }

    const busesRef = ref(db, "buses");
    const unsubscribe = onValue(
      busesRef,
      (snapshot) => {
        setBuses(flatten(snapshot.val()));
        setSource("firebase");
        setLoading(false);
      },
      (error) => {
        console.error("Firebase read failed, falling back to simulated data:", error);
        setSource("mock");
        setBuses(flatten(mockState.current));
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { buses, loading, source };
}
