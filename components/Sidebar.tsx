"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/lib/useAuth";

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard" },
  { href: "/fares", label: "Fares" },
  { href: "/bus-info", label: "Bus Info" },
];

const INFO_NAV_ITEMS: NavItem[] = [
  { href: "/mission", label: "Mission" },
  { href: "/vision", label: "Vision" },
  { href: "/about", label: "About Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { operator, loading, signOut } = useAuth();

  const displayName = operator?.full_name || operator?.email || "Guest";
  const roleLine = operator?.fleet_name || operator?.email || "Fleet Operator";
  const initial = displayName.charAt(0).toUpperCase();

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        {open ? "✕" : "☰"}
      </button>

      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Image
              src="/logo.jpg"
              alt="BUSAhero logo"
              width={34}
              height={34}
              className="brand-logo"
            />
          </div>

          <div>
            <div className="brand-name">BUSAhero</div>

            <div className="brand-sub">Operator Console</div>
          </div>
        </div>

        <div className="nav-group-label">Main</div>

        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-group-label">About BUSahero</div>

        <nav className="nav">
          {INFO_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="op-card">
            <div className="op-avatar">{loading ? "…" : initial}</div>

            <div>
              <div className="op-name">
                {loading ? "Loading…" : displayName}
              </div>

              <div className="op-role">{loading ? "" : roleLine}</div>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <svg
              className="logout-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
