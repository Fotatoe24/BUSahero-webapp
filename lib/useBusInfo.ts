"use client";

import { useCallback, useEffect, useState } from "react";
import { BusInfo } from "@/types/busInfo";
import { ref, onValue, push, set, update, remove } from "firebase/database";

import { db, hasFirebaseConfig } from "./firebase";

interface BusInfoInput {
  busNumber: string;
  plateNumber: string;
  driverName: string;
  route?: string;
}

type BusInfoSource = "firebase" | "mock";

const SEED_BUS_INFO: Record<string, Omit<BusInfo, "id">> = {
  "busInfo-1": {
    busNumber: "BUS-01",
    plateNumber: "ABC 1234",
    driverName: "Rosa Santos",
    route: "Olongapo → Iba",
    updatedAt: Date.now(),
  },

  "busInfo-2": {
    busNumber: "BUS-02",
    plateNumber: "XYZ 5678",
    driverName: "Mel Reyes",
    route: "Olongapo → Botolan",
    updatedAt: Date.now(),
  },

  "busInfo-3": {
    busNumber: "BUS-03",
    plateNumber: "DEF 9012",
    driverName: "Jun Cruz",
    route: "Olongapo → Subic",
    updatedAt: Date.now(),
  },
};

function toArray(
  busInfoObj: Record<string, Omit<BusInfo, "id">> | null | undefined
): BusInfo[] {
  return Object.entries(busInfoObj ?? {})
    .map(([id, info]) => ({
      id,
      ...info,
    }))
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

export function useBusInfo() {
  const [busInfo, setBusInfo] = useState<BusInfo[]>(
    hasFirebaseConfig ? [] : toArray(SEED_BUS_INFO)
  );

  const [loading, setLoading] = useState<boolean>(hasFirebaseConfig);

  const [localBusInfo, setLocalBusInfo] = useState(SEED_BUS_INFO);

  useEffect(() => {
    if (!hasFirebaseConfig) return;

    if (!db) return;

    const busInfoRef = ref(db, "busInfo");

    const unsubscribe = onValue(
      busInfoRef,

      (snapshot) => {
        setBusInfo(toArray(snapshot.val()));

        setLoading(false);
      },

      (error) => {
        console.error(
          "Firebase busInfo read failed, falling back to local state:",
          error
        );

        setBusInfo(toArray(SEED_BUS_INFO));

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addBusInfo = useCallback(
    async ({ busNumber, plateNumber, driverName, route }: BusInfoInput) => {
      const payload = {
        busNumber,
        plateNumber,
        driverName,
        route: route ?? "",
        updatedAt: Date.now(),
      };

      if (hasFirebaseConfig && db) {
        const newRef = push(ref(db, "busInfo"));
        await set(newRef, payload);
      } else {
        setLocalBusInfo((prev) => {
          const id = `busInfo-${Date.now()}`;

          const next = {
            ...prev,
            [id]: payload,
          };

          setBusInfo(toArray(next));

          return next;
        });
      }
    },
    [db]
  );

  const updateBusInfo = useCallback(
    async (
      id: string,
      { busNumber, plateNumber, driverName, route }: BusInfoInput
    ) => {
      const payload = {
        busNumber,
        plateNumber,
        driverName,
        route: route ?? "",
        updatedAt: Date.now(),
      };

      if (hasFirebaseConfig && db) {
        await update(ref(db, `busInfo/${id}`), payload);
      } else {
        setLocalBusInfo((prev) => {
          const next = {
            ...prev,
            [id]: payload,
          };

          setBusInfo(toArray(next));

          return next;
        });
      }
    },
    []
  );

  const deleteBusInfo = useCallback(async (id: string) => {
    if (hasFirebaseConfig && db) {
      await remove(ref(db, `busInfo/${id}`));
    } else {
      setLocalBusInfo((prev) => {
        const next = {
          ...prev,
        };

        delete next[id];

        setBusInfo(toArray(next));

        return next;
      });
    }
  }, []);

  return {
    busInfo,
    loading,
    addBusInfo,
    updateBusInfo,
    deleteBusInfo,
    source: hasFirebaseConfig ? "firebase" : "mock",
  };
}
