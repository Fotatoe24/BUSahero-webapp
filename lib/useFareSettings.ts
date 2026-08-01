"use client";

import { useCallback, useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { FareSettings } from "@/types/fareSettings";
import { db, hasFirebaseConfig } from "./firebase";

const DEFAULT_SETTINGS: FareSettings = {
  baseFare: 12.0,
  baseDistanceKm: 5,
  perKmRate: 2.2,
  discountPercent: 20,
  updatedAt: Date.now(),
};

export function useFareSettings() {
  const [settings, setSettings] = useState<FareSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(hasFirebaseConfig);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) {
      setLoading(false);
      return;
    }

    const settingsRef = ref(db, "fareSettings");

    const unsubscribe = onValue(
      settingsRef,
      (snapshot) => {
        const val = snapshot.val();
        setSettings(val ? { ...DEFAULT_SETTINGS, ...val } : DEFAULT_SETTINGS);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Firebase fareSettings read failed, falling back to defaults:",
          error
        );
        setSettings(DEFAULT_SETTINGS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateSettings = useCallback(
    async (values: Omit<FareSettings, "updatedAt">) => {
      const payload: FareSettings = { ...values, updatedAt: Date.now() };

      if (hasFirebaseConfig && db) {
        await set(ref(db, "fareSettings"), payload);
      } else {
        setSettings(payload);
      }
    },
    []
  );

  return {
    settings,
    loading,
    updateSettings,
    source: hasFirebaseConfig ? "firebase" : "mock",
  };
}
