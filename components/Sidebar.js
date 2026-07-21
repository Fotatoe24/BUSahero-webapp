"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/fares", label: "Fares" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">🚌</div>
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
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="op-card">
          <div className="op-avatar">R</div>
          <div>
            <div className="op-name">Rosa Santos</div>
            <div className="op-role">Fleet Operator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
