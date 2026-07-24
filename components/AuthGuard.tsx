"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/"); // login now lives at "/"
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="empty-state">Checking your session…</div>;
  }

  return <>{children}</>;
}
