"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Operator {
  id: string;
  email: string;
  full_name: string;
  fleet_name: string;
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchOperatorProfile(
  supabase: ReturnType<typeof createClient>,
  user: User
): Promise<Operator> {
  const { data, error } = await supabase
    .from("operators")
    .select("id, email, full_name, fleet_name")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    // Fallback so a missing profile row doesn't hard-crash the app —
    // full_name/fleet_name will just be blank until the row is fixed.
    return {
      id: user.id,
      email: user.email ?? "",
      full_name: "",
      fleet_name: "",
    };
  }

  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const profile = await fetchOperatorProfile(supabase, data.session.user);
        setOperator(profile);
      }

      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchOperatorProfile(supabase, session.user);
        setOperator(profile);
      } else {
        setOperator(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: "Invalid email or password." };
    }

    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setOperator(null);
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
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        fleet_name: fleetName,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: data.error || "Could not create account." };
    }

    // /api/register creates the Supabase Auth user server-side but
    // doesn't sign them in — do that now so the client gets a session.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: "Account created, but sign-in failed. Try logging in." };
    }

    return { error: null };
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

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}
