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
  { href: "/dashboard", label: "Dashboard" },
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

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function FaresIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 7.5h3.2a2.3 2.3 0 0 1 0 4.6H9.5" />
      <path d="M9.5 10.4h4.2" />
      <path d="M9.5 7.5v9" />
    </svg>
  );
}

function BusInfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M3 11h18" />
      <path d="M7 5V3h10v2" />
      <circle cx="7.5" cy="17" r="1.6" />
      <circle cx="16.5" cy="17" r="1.6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

const BOTTOM_NAV_ICONS: Record<string, () => JSX.Element> = {
  "/dashboard": DashboardIcon,
  "/fares": FaresIcon,
  "/bus-info": BusInfoIcon,
};

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
    router.replace("/");
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

        <div className="sidebar-main-nav">
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
        </div>

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

      <nav className="bottom-nav" aria-label="Primary">
        <div className="bottom-nav-list">
          {NAV_ITEMS.map((item) => {
            const Icon = BOTTOM_NAV_ICONS[item.href];
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`bottom-nav-item ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="bottom-nav-icon-bg">
                  <Icon />
                </span>
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            className={`bottom-nav-item ${open ? "active" : ""}`}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="bottom-nav-icon-bg">
              <MenuIcon />
            </span>
            Menu
          </button>
        </div>
      </nav>
    </>
  );
}
