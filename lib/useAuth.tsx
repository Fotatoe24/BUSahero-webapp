"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface Operator {
  id: string;
  email: string;
  full_name: string;
  fleet_name: string | null;
}

interface AuthContextValue {
  operator: Operator | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    fleetName: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const res = await fetch("/api/me");
    const data = await res.json();
    setOperator(data.operator);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function signIn(email: string, password: string) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return { error: data.error || "Sign in failed." };

    await refresh();
    return { error: null };
  }

  async function signUp(
    email: string,
    password: string,
    fullName: string,
    fleetName: string
  ) {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName, fleetName }),
    });

    const data = await res.json();
    if (!res.ok) return { error: data.error || "Registration failed." };

    await refresh();
    return { error: null };
  }

  async function signOut() {
    await fetch("/api/logout", { method: "POST" });
    setOperator(null);
  }

  return (
    <AuthContext.Provider
      value={{ operator, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
