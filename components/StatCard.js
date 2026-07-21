export default function StatCard({ label, value, foot, footTone }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {foot && <div className={`stat-foot ${footTone || ""}`}>{foot}</div>}
    </div>
  );
}
