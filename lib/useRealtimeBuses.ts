"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { db, hasFirebaseConfig } from "./firebase";

interface Bus {
  id: string;
  region: string;
  latitude: number;
  longitude: number;
  satellites: number;
  speed: number;
  status: "In Transit" | "Stopped" | "Delayed" | string;
  updatedAt: number;
  driverName?: string;
  conductorName?: string;
  plateNum?: string;
}

interface BusData {
  latitude: number;
  longitude: number;
  satellites: number;
  speed: number;
  status: string;
  updatedAt: number;
  DriverName?: string;
  ConductorName?: string;
  PlateNum?: string;
}

type BusSource = "firebase" | "mock";

type BusRegions = Record<string, Record<string, BusData>>;

const MOCK_BUSES: BusRegions = {
  north: {
    bus1: {
      latitude: 15.06703,
      longitude: 120.06764,
      satellites: 8,
      speed: 0,
      status: "Stopped",
      updatedAt: Date.now(),
      DriverName: "Juan Dela Cruz",
      ConductorName: "Ramon Reyes",
      PlateNum: "ABC123",
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
      DriverName: "Maria Santos",
      ConductorName: "Liza Fernandez",
      PlateNum: "XYZ789",
    },
  },
};

function flatten(busesByRegion: BusRegions | null | undefined): Bus[] {
  const out: Bus[] = [];

  Object.entries(busesByRegion ?? {}).forEach(([region, busesInRegion]) => {
    Object.entries(busesInRegion ?? {}).forEach(([busId, data]) => {
      out.push({
        id: busId,
        region,
        latitude: data.latitude,
        longitude: data.longitude,
        satellites: data.satellites,
        speed: data.speed,
        status: data.status,
        updatedAt: data.updatedAt,
        driverName: data.DriverName ?? "",
        conductorName: data.ConductorName ?? "",
        plateNum: data.PlateNum ?? "",
      });
    });
  });

  return out.sort((a, b) => a.id.localeCompare(b.id));
}

export function useRealtimeBuses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [source, setSource] = useState<BusSource>(
    hasFirebaseConfig ? "firebase" : "mock"
  );

  const mockState = useRef<BusRegions>(structuredClone(MOCK_BUSES));

  useEffect(() => {
    if (!hasFirebaseConfig) {
      setBuses(flatten(mockState.current));
      setLoading(false);

      const interval = setInterval(() => {
        Object.values(mockState.current).forEach((region) => {
          Object.values(region).forEach((bus) => {
            const moving = Math.random() > 0.35;

            bus.speed = moving ? Math.round(20 + Math.random() * 40) : 0;
            bus.status = moving ? "In Transit" : "Stopped";

            if (moving) {
              bus.latitude += (Math.random() - 0.5) * 0.002;
              bus.longitude += (Math.random() - 0.5) * 0.002;
            }

            bus.satellites = 5 + Math.floor(Math.random() * 5);
            bus.updatedAt = Date.now();
          });
        });

        setBuses(flatten(mockState.current));
      }, 3000);

      return () => clearInterval(interval);
    }

    if (!db) return;

    const busesRef = ref(db, "buses");

    const unsubscribe = onValue(
      busesRef,
      (snapshot) => {
        setBuses(flatten(snapshot.val()));
        setSource("firebase");
        setLoading(false);
      },
      (error) => {
        console.error(
          "Firebase read failed, falling back to simulated data:",
          error
        );

        setSource("mock");
        setBuses(flatten(mockState.current));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateBusInfo = useCallback(
    async (
      region: string,
      busId: string,
      values: { driverName: string; conductorName: string; plateNum: string }
    ) => {
      const payload = {
        DriverName: values.driverName,
        ConductorName: values.conductorName,
        PlateNum: values.plateNum,
      };

      if (hasFirebaseConfig && db) {
        await update(ref(db, `buses/${region}/${busId}`), payload);
      } else {
        const bus = mockState.current[region]?.[busId];

        if (bus) {
          bus.DriverName = values.driverName;
          bus.ConductorName = values.conductorName;
          bus.PlateNum = values.plateNum;
        }

        setBuses(flatten(mockState.current));
      }
    },
    []
  );

  return {
    buses,
    loading,
    source,
    updateBusInfo,
  };
}
