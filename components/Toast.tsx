"use client";

import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, 2400);
  }, []);

  function Toast() {
    return <div className={`toast ${visible ? "show" : ""}`}>{message}</div>;
  }

  return {
    showToast,
    Toast,
  };
}
