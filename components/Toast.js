"use client";

import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setMessage(msg);
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2400);
  }, []);

  const Toast = () => <div className={`toast ${visible ? "show" : ""}`}>{message}</div>;

  return { showToast, Toast };
}
