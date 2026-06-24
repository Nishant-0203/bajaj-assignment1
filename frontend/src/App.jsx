import { useState } from "react";
import axios from "axios";
import InputBox from "./components/InputBox";
import ResultCard from "./components/ResultCard";
import Summary from "./components/Summary";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [input, setInput]     = useState("");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Parse lines → array
    const data = trimmed
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data: res } = await axios.post(`${API_URL}/bfhl`, { data }, {
        headers: { "Content-Type": "application/json" },
        timeout: 10_000,
      });
      setResult(res);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Failed to reach the API. Is the backend running?";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const trees   = result?.hierarchies?.filter((h) => !h.has_cycle) ?? [];
  const cycles  = result?.hierarchies?.filter((h) => h.has_cycle)  ?? [];
  const invalid = result?.invalid_entries ?? [];
  const dupes   = result?.duplicate_edges ?? [];

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <a href="/" className="header-brand">
            <div className="brand-icon">🌳</div>
            <span className="brand-text">HierarchyLab</span>
          </a>
          <span className="header-badge">BFHL Challenge</span>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main-content">
        <div className="page-title">
          <h1>Tree Hierarchy Analyser</h1>
          <p>Enter edge pairs to detect trees, cycles, and build nested hierarchies in milliseconds.</p>
        </div>

        <InputBox
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {error && (
          <div className="error-banner" role="alert">
            <span className="error-icon">⛔</span>
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="results-grid">
            {/* Summary */}
            <Summary data={result.summary} />

            {/* Meta: user info */}
            <div className="glass-card" style={{ padding: "1rem 1.5rem" }}>
              <div className="card-heading">
                <span className="card-heading-icon">🪪</span>
                Submission Info
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                <span><strong style={{ color: "var(--text-primary)" }}>ID: </strong>{result.user_id}</span>
                <span><strong style={{ color: "var(--text-primary)" }}>Email: </strong>{result.email_id}</span>
                <span><strong style={{ color: "var(--text-primary)" }}>Roll: </strong>{result.college_roll_number}</span>
              </div>
            </div>

            {/* Trees */}
            {trees.length > 0 && (
              <section className="hierarchies-section">
                <div className="section-title">
                  <span>🌲</span> Trees ({trees.length})
                </div>
                <div className="hierarchy-list">
                  {trees.map((item, i) => (
                    <ResultCard key={`tree-${item.root}`} item={item} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Cycles */}
            {cycles.length > 0 && (
              <section className="hierarchies-section">
                <div className="section-title">
                  <span>🔄</span> Cyclic Groups ({cycles.length})
                </div>
                <div className="hierarchy-list">
                  {cycles.map((item, i) => (
                    <ResultCard key={`cycle-${item.root}`} item={item} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Invalid entries */}
            {invalid.length > 0 && (
              <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
                <div className="card-heading">
                  <span className="card-heading-icon">❌</span>
                  Invalid Entries ({invalid.length})
                </div>
                <div className="chips-row">
                  {invalid.map((e, i) => (
                    <span key={i} className="chip invalid">{e || '""'}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Duplicate edges */}
            {dupes.length > 0 && (
              <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
                <div className="card-heading">
                  <span className="card-heading-icon">⚠️</span>
                  Duplicate Edges ({dupes.length})
                </div>
                <div className="chips-row">
                  {dupes.map((d, i) => (
                    <span key={i} className="chip duplicate">{d}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Raw JSON (collapsible) */}
            <details className="glass-card" style={{ padding: "1rem 1.5rem" }}>
              <summary style={{ cursor: "pointer", fontSize: "0.82rem", color: "var(--text-secondary)", userSelect: "none", fontWeight: 600 }}>
                📋 Raw JSON Response
              </summary>
              <pre style={{
                marginTop: "1rem",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                background: "rgba(8,12,20,0.6)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem",
                overflowX: "auto",
                lineHeight: 1.6,
              }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        HierarchyLab · BFHL Challenge · Built with React + Express
      </footer>
    </div>
  );
}
