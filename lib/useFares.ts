"use client";

import { useCallback, useEffect, useState } from "react";
import { Fare } from "@/types/fare";
import { ref, onValue, push, set, update, remove } from "firebase/database";

import { db, hasFirebaseConfig } from "./firebase";

interface FareInput {
  route: string;
  distanceKm: string | number;
}

type FareSource = "firebase" | "mock";

// Approximate road distances for the seeded demo routes (km).
const SEED_FARES: Record<string, Omit<Fare, "id">> = {
  "fare-1": {
    route: "Olongapo → Iba",
    distanceKm: 75,
    updatedAt: Date.now(),
  },

  "fare-2": {
    route: "Olongapo → Botolan",
    distanceKm: 40,
    updatedAt: Date.now(),
  },

  "fare-3": {
    route: "Olongapo → Subic",
    distanceKm: 15,
    updatedAt: Date.now(),
  },
};

function toArray(
  faresObj: Record<string, Omit<Fare, "id">> | null | undefined
): Fare[] {
  return Object.entries(faresObj ?? {})
    .map(([id, fare]) => ({
      id,
      ...fare,
    }))
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

export function useFares() {
  const [fares, setFares] = useState<Fare[]>(
    hasFirebaseConfig ? [] : toArray(SEED_FARES)
  );

  const [loading, setLoading] = useState<boolean>(hasFirebaseConfig);

  const [localFares, setLocalFares] = useState(SEED_FARES);

  useEffect(() => {
    if (!hasFirebaseConfig) return;

    if (!db) return;

    const faresRef = ref(db, "fares");

    const unsubscribe = onValue(
      faresRef,

      (snapshot) => {
        setFares(toArray(snapshot.val()));

        setLoading(false);
      },

      (error) => {
        console.error(
          "Firebase fares read failed, falling back to local state:",
          error
        );

        setFares(toArray(SEED_FARES));

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addFare = useCallback(
    async ({ route, distanceKm }: FareInput) => {
      const payload = {
        route,
        distanceKm: Number(distanceKm),
        updatedAt: Date.now(),
      };

      if (hasFirebaseConfig && db) {
        const newRef = push(ref(db, "fares"));
        await set(newRef, payload);
      } else {
        setLocalFares((prev) => {
          const id = `fare-${Date.now()}`;

          const next = {
            ...prev,
            [id]: payload,
          };

          setFares(toArray(next));

          return next;
        });
      }
    },
    [db]
  );

  const updateFare = useCallback(
    async (id: string, { route, distanceKm }: FareInput) => {
      const payload = {
        route,
        distanceKm: Number(distanceKm),
        updatedAt: Date.now(),
      };

      if (hasFirebaseConfig && db) {
        await update(ref(db, `fares/${id}`), payload);
      } else {
        setLocalFares((prev) => {
          const next = {
            ...prev,
            [id]: payload,
          };

          setFares(toArray(next));

          return next;
        });
      }
    },
    []
  );

  const deleteFare = useCallback(async (id: string) => {
    if (hasFirebaseConfig && db) {
      await remove(ref(db, `fares/${id}`));
    } else {
      setLocalFares((prev) => {
        const next = {
          ...prev,
        };

        delete next[id];

        setFares(toArray(next));

        return next;
      });
    }
  }, []);

  return {
    fares,
    loading,
    addFare,
    updateFare,
    deleteFare,
    source: hasFirebaseConfig ? "firebase" : "mock",
  };
}
