"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { operator, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !operator) {
      router.replace("/"); // login lives at "/"
    }
  }, [loading, operator, router]);

  if (loading || !operator) {
    return <div className="empty-state">Checking your session…</div>;
  }

  return <>{children}</>;
}
