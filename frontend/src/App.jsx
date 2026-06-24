import { useState } from "react";
import axios from "axios";
import InputBox from "./components/InputBox";
import ResultCard from "./components/ResultCard";
import Summary from "./components/Summary";
import "./index.css";

// fallback to local if env isn't available
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed) return;

    // clean up quotes and brackets from input string
    const data = trimmed
      .split(/[\r\n,]+/)
      .map((l) => l.trim().replace(/^["'\[{]+|["'\]}]+$/g, "").trim())
      .filter(Boolean);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // call our backend
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

  const trees = result?.hierarchies?.filter((h) => !h.has_cycle) ?? [];
  const cycles = result?.hierarchies?.filter((h) => h.has_cycle) ?? [];
  const invalid = result?.invalid_entries ?? [];
  const dupes = result?.duplicate_edges ?? [];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <a href="/" className="header-brand">
            <div className="brand-icon">🏥</div>
            <span className="brand-text">Bajaj Finserv Health</span>
          </a>
          <div className="header-right">
            <span className="header-dot" title="API live" />
            <span className="header-badge">BFHL Round 1</span>
          </div>
        </div>
      </header>

      <div className="hero">
        <span className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          Bajaj Finserv Health · Round 1 Assignment
        </span>
        <h1>
          <span className="gradient-text">BFHL Tree</span>
          <br />Hierarchy Analyser
        </h1>
        <p>
          Submit edge pairs to the <code style={{fontFamily:'JetBrains Mono,monospace', fontSize:'0.9em', color:'var(--accent-primary)'}}>POST /bfhl</code> endpoint — detect trees, cycles, and build nested hierarchies instantly.
        </p>
      </div>

      <main className="main-content">
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
            <Summary data={result.summary} />

            <div className="glass-card" style={{ padding: "1.4rem 1.6rem" }}>
              <div className="card-heading">
                <span className="card-heading-icon">🪪</span>
                Submission Info
              </div>
              <div className="meta-grid">
                <div className="meta-item">
                  <div className="meta-key">User ID</div>
                  <div className="meta-val">{result.user_id}</div>
                </div>
                <div className="meta-item">
                  <div className="meta-key">Email</div>
                  <div className="meta-val">{result.email_id}</div>
                </div>
                <div className="meta-item">
                  <div className="meta-key">Roll Number</div>
                  <div className="meta-val">{result.college_roll_number}</div>
                </div>
              </div>
            </div>

            {trees.length > 0 && (
              <section>
                <div className="section-header">
                  <span style={{ fontSize: "1rem" }}>🌲</span>
                  <span className="section-label">Trees</span>
                  <span className="section-count-badge">{trees.length}</span>
                  <span className="section-line" />
                </div>
                <div className="hierarchies-section">
                  {trees.map((item, i) => (
                    <ResultCard key={`tree-${item.root}`} item={item} index={i} />
                  ))}
                </div>
              </section>
            )}

            {cycles.length > 0 && (
              <section>
                <div className="section-header">
                  <span style={{ fontSize: "1rem" }}>🔄</span>
                  <span className="section-label">Cyclic Groups</span>
                  <span className="section-count-badge danger">{cycles.length}</span>
                  <span className="section-line" />
                </div>
                <div className="hierarchies-section">
                  {cycles.map((item, i) => (
                    <ResultCard key={`cycle-${item.root}`} item={item} index={i} />
                  ))}
                </div>
              </section>
            )}

            {(invalid.length > 0 || dupes.length > 0) && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                {invalid.length > 0 && (
                  <div className="glass-card" style={{ padding: "1.4rem 1.6rem" }}>
                    <div className="card-heading">
                      <span className="card-heading-icon">❌</span>
                      Invalid Entries
                      <span className="section-count-badge danger" style={{ marginLeft: "auto" }}>{invalid.length}</span>
                    </div>
                    <div className="chips-row">
                      {invalid.map((e, i) => (
                        <span key={i} className="chip invalid">{e || '""'}</span>
                      ))}
                    </div>
                  </div>
                )}

                {dupes.length > 0 && (
                  <div className="glass-card" style={{ padding: "1.4rem 1.6rem" }}>
                    <div className="card-heading">
                      <span className="card-heading-icon">⚠️</span>
                      Duplicate Edges
                      <span className="section-count-badge" style={{ marginLeft: "auto", background: "rgba(251,191,36,0.1)", borderColor: "rgba(251,191,36,0.2)", color: "var(--accent-warning)" }}>{dupes.length}</span>
                    </div>
                    <div className="chips-row">
                      {dupes.map((d, i) => (
                        <span key={i} className="chip duplicate">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <details className="glass-card raw-json-details">
              <summary>
                <span className="raw-json-toggle">▶</span>
                📋 Raw JSON Response
              </summary>
              <pre className="raw-json-pre">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <span>Bajaj Finserv Health</span>
        <span className="footer-dot" />
        <span>BFHL Round 1 Assignment</span>
        <span className="footer-dot" />
        <span>Built with React + Express</span>
      </footer>
    </div>
  );
}
