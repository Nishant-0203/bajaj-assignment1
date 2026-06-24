export default function Summary({ data }) {
  const { total_trees, total_cycles, largest_tree_root } = data;

  return (
    <div className="glass-card summary-card">
      <div className="card-heading">
        <span className="card-heading-icon">📊</span>
        Summary
      </div>

      <div className="summary-stats">
        <div className="stat-box">
          <div className="stat-value">{total_trees}</div>
          <div className="stat-label">Total Trees</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{
            background: total_cycles > 0
              ? "linear-gradient(135deg, var(--accent-danger), #dc2626)"
              : undefined,
            WebkitBackgroundClip: total_cycles > 0 ? "text" : undefined,
            backgroundClip: total_cycles > 0 ? "text" : undefined,
          }}>
            {total_cycles}
          </div>
          <div className="stat-label">Cycle Groups</div>
        </div>
        <div className="stat-box highlight">
          <div className="stat-value">{largest_tree_root || "—"}</div>
          <div className="stat-label">Largest Tree Root</div>
        </div>
      </div>
    </div>
  );
}
