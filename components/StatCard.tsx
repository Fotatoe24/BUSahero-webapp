"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  foot?: string;
  footTone?: string;
}

export default function StatCard({
  label,
  value,
  foot,
  footTone,
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>

      <div className="stat-value">{value}</div>

      {foot && <div className={`stat-foot ${footTone || ""}`}>{foot}</div>}
    </div>
  );
}
