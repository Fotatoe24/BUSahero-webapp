"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/useAuth";

interface MapTile {
  id: string;
  label: string;
  top: string;
  left: string;
  rotate: number;
  width: number;
  height: number;
  roadAngle: number;
  tone: "blue" | "green" | "amber";
}

// Scattered "map" collage tiles, styled after the fare routes already
// seeded in the app (see lib/useFares.ts) so the background feels like
// it belongs to this product rather than a generic stock map.
const MAP_TILES: MapTile[] = [
  {
    id: "t1",
    label: "OLONGAPO",
    top: "4%",
    left: "2%",
    rotate: -8,
    width: 230,
    height: 160,
    roadAngle: 22,
    tone: "blue",
  },
  {
    id: "t2",
    label: "SUBIC",
    top: "10%",
    left: "24%",
    rotate: 6,
    width: 190,
    height: 140,
    roadAngle: -15,
    tone: "green",
  },
  {
    id: "t3",
    label: "IBA",
    top: "2%",
    left: "46%",
    rotate: -4,
    width: 210,
    height: 150,
    roadAngle: 35,
    tone: "amber",
  },
  {
    id: "t4",
    label: "BOTOLAN",
    top: "8%",
    left: "68%",
    rotate: 9,
    width: 220,
    height: 155,
    roadAngle: -25,
    tone: "blue",
  },
  {
    id: "t5",
    label: "CANDELARIA",
    top: "2%",
    left: "88%",
    rotate: -6,
    width: 200,
    height: 145,
    roadAngle: 12,
    tone: "green",
  },

  {
    id: "t6",
    label: "STA. CRUZ",
    top: "34%",
    left: "-2%",
    rotate: 5,
    width: 200,
    height: 145,
    roadAngle: -30,
    tone: "amber",
  },
  {
    id: "t7",
    label: "MASINLOC",
    top: "38%",
    left: "20%",
    rotate: -7,
    width: 190,
    height: 135,
    roadAngle: 18,
    tone: "blue",
  },
  {
    id: "t8",
    label: "PALAUIG",
    top: "32%",
    left: "80%",
    rotate: 8,
    width: 210,
    height: 150,
    roadAngle: -20,
    tone: "green",
  },
  {
    id: "t9",
    label: "SAN MARCELINO",
    top: "40%",
    left: "92%",
    rotate: -5,
    width: 200,
    height: 145,
    roadAngle: 28,
    tone: "amber",
  },

  {
    id: "t10",
    label: "SAN FELIPE",
    top: "66%",
    left: "0%",
    rotate: -6,
    width: 210,
    height: 150,
    roadAngle: 14,
    tone: "blue",
  },
  {
    id: "t11",
    label: "CABANGAN",
    top: "70%",
    left: "22%",
    rotate: 7,
    width: 190,
    height: 140,
    roadAngle: -32,
    tone: "green",
  },
  {
    id: "t12",
    label: "SAN ANTONIO",
    top: "72%",
    left: "76%",
    rotate: -8,
    width: 220,
    height: 155,
    roadAngle: 20,
    tone: "amber",
  },
  {
    id: "t13",
    label: "ZAMBALES",
    top: "68%",
    left: "90%",
    rotate: 6,
    width: 200,
    height: 145,
    roadAngle: -16,
    tone: "blue",
  },
];

export default function LoginPage() {
  const { operator, loading, signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && operator) {
      router.replace("/dashboard");
    }
  }, [loading, operator, router]);

  if (loading || operator) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { error } = await signIn(email, password);

    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="login-shell">
      <div className="login-bg" aria-hidden="true">
        {MAP_TILES.map((tile) => (
          <div
            key={tile.id}
            className={`map-tile map-tile-${tile.tone}`}
            style={{
              top: tile.top,
              left: tile.left,
              width: tile.width,
              height: tile.height,
              transform: `rotate(${tile.rotate}deg)`,
            }}
          >
            <div
              className="map-tile-road map-tile-road-a"
              style={{ transform: `rotate(${tile.roadAngle}deg)` }}
            />
            <div
              className="map-tile-road map-tile-road-b"
              style={{ transform: `rotate(${tile.roadAngle + 70}deg)` }}
            />

            <div className="map-tile-pin" />

            <span className="map-tile-label">{tile.label}</span>
          </div>
        ))}

        <div className="login-bg-overlay" />
      </div>

      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <div className="login-logo">
          <div className="login-logo-mark">
            <Image
              src="/logo.jpg"
              alt="BUSahero logo"
              width={40}
              height={40}
              priority
            />
          </div>

          <div>
            <div className="brand-name">BUSahero</div>
            <div className="brand-sub">Operator Console</div>
          </div>
        </div>

        <h1 className="login-title">Log in to your fleet</h1>
        <p className="login-subtitle">
          Monitor buses and manage fares in real time.
        </p>

        <label className="field-label login-field-label" htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          className="text-input login-input"
          placeholder="you@busahero.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />

        <label className="field-label login-field-label" htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          className="text-input login-input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <div className={`form-error ${error ? "show" : ""}`}>{error}</div>

        <div className="login-forgot-row">
          <Link href="/forgot-password" className="login-forgot">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn btn-primary login-submit"
          disabled={submitting}
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>

        <p className="login-signup">
          No account? <Link href="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
