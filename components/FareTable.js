export default function FareTable({ fares, loading, onEdit }) {
  if (loading) {
    return <div className="empty-state">Loading fares…</div>;
  }
  if (!fares.length) {
    return <div className="empty-state">No fares configured yet. Add your first route fare.</div>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Regular fare</th>
          <th>Student / senior fare</th>
          <th>Last updated</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {fares.map((f) => (
          <tr key={f.id}>
            <td className="pname">{f.route}</td>
            <td className="mono">₱{f.regular}</td>
            <td className="mono">₱{f.discounted}</td>
            <td className="mono">{new Date(f.updatedAt).toLocaleDateString()}</td>
            <td>
              <button className="row-btn" title="Edit fare" onClick={() => onEdit(f.id)}>
                ✎
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
