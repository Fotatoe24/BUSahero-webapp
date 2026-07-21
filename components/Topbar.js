"use client";

export default function Topbar({ title, subtitle, source }) {
  const isLive = source === "firebase";
  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{subtitle}</div>
      </div>
      <div className="topbar-right">
        <span className={`live-pill ${isLive ? "" : "mock"}`}>
          <span className="live-dot" />
          {isLive ? "LIVE · FIREBASE" : "DEMO DATA"}
        </span>
      </div>
    </header>
  );
}
