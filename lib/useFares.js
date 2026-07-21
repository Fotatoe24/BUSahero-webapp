"use client";

import { useCallback, useEffect, useState } from "react";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { db } from "./firebase";

const hasFirebaseConfig = !!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

const SEED_FARES = {
  "fare-1": { route: "Olongapo → Iba", regular: 180, discounted: 144, updatedAt: Date.now() },
  "fare-2": { route: "Olongapo → Botolan", regular: 120, discounted: 96, updatedAt: Date.now() },
  "fare-3": { route: "Olongapo → Subic", regular: 45, discounted: 36, updatedAt: Date.now() },
};

function toArray(faresObj) {
  return Object.entries(faresObj || {})
    .map(([id, f]) => ({ id, ...f }))
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function useFares() {
  const [fares, setFares] = useState(hasFirebaseConfig ? [] : toArray(SEED_FARES));
  const [loading, setLoading] = useState(hasFirebaseConfig);
  const [localFares, setLocalFares] = useState(SEED_FARES);

  useEffect(() => {
    if (!hasFirebaseConfig) return;
    const faresRef = ref(db, "fares");
    const unsubscribe = onValue(
      faresRef,
      (snapshot) => {
        setFares(toArray(snapshot.val()));
        setLoading(false);
      },
      (error) => {
        console.error("Firebase fares read failed, falling back to local state:", error);
        setFares(toArray(SEED_FARES));
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const addFare = useCallback(async ({ route, regular, discounted }) => {
    const payload = { route, regular: Number(regular), discounted: Number(discounted), updatedAt: Date.now() };
    if (hasFirebaseConfig) {
      const newRef = push(ref(db, "fares"));
      await set(newRef, payload);
    } else {
      setLocalFares((prev) => {
        const id = `fare-${Date.now()}`;
        const next = { ...prev, [id]: payload };
        setFares(toArray(next));
        return next;
      });
    }
  }, []);

  const updateFare = useCallback(async (id, { route, regular, discounted }) => {
    const payload = { route, regular: Number(regular), discounted: Number(discounted), updatedAt: Date.now() };
    if (hasFirebaseConfig) {
      await update(ref(db, `fares/${id}`), payload);
    } else {
      setLocalFares((prev) => {
        const next = { ...prev, [id]: payload };
        setFares(toArray(next));
        return next;
      });
    }
  }, []);

  const deleteFare = useCallback(async (id) => {
    if (hasFirebaseConfig) {
      await remove(ref(db, `fares/${id}`));
    } else {
      setLocalFares((prev) => {
        const next = { ...prev };
        delete next[id];
        setFares(toArray(next));
        return next;
      });
    }
  }, []);

  return { fares, loading, addFare, updateFare, deleteFare, source: hasFirebaseConfig ? "firebase" : "local" };
}
