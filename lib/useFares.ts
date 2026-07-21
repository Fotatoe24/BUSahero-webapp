"use client";

import { useCallback, useEffect, useState } from "react";
import { Fare } from "@/types/fare";
import { ref, onValue, push, set, update, remove } from "firebase/database";

import { db, hasFirebaseConfig } from "./firebase";

interface FareInput {
  route: string;
  regular: string | number;
  discounted: string | number;
}

type FareSource = "firebase" | "mock";

const SEED_FARES: Record<string, Omit<Fare, "id">> = {
  "fare-1": {
    route: "Olongapo → Iba",
    regular: 180,
    discounted: 144,
    updatedAt: Date.now(),
  },

  "fare-2": {
    route: "Olongapo → Botolan",
    regular: 120,
    discounted: 96,
    updatedAt: Date.now(),
  },

  "fare-3": {
    route: "Olongapo → Subic",
    regular: 45,
    discounted: 36,
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
    async ({ route, regular, discounted }: FareInput) => {
      const payload = {
        route,
        regular: Number(regular),
        discounted: Number(discounted),
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
    async (id: string, { route, regular, discounted }: FareInput) => {
      const payload = {
        route,
        regular: Number(regular),
        discounted: Number(discounted),
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
