const SAMPLE = `A->B
A->C
B->D
C->E
E->F
P->Q
Q->R`;

export default function InputBox({ value, onChange, onSubmit, loading }) {
  function handleKey(e) {
    // Ctrl+Enter submits
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit();
    }
  }

  function loadSample() {
    onChange(SAMPLE);
  }

  return (
    <section className="input-section">
      <div className="glass-card input-card">
        <div className="input-label">
          <span className="input-label-dot" />
          Edge Input
        </div>

        <textarea
          id="edge-input"
          className="edge-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={"A->B\nA->C\nB->D\n\nEnter one edge per line…"}
          spellCheck={false}
          aria-label="Edge list input"
        />

        <div className="input-footer">
          <span className="input-hint">
            Format: <code style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--accent-primary)", fontSize: "0.78rem" }}>X-&gt;Y</code>
            &nbsp;·&nbsp;One per line&nbsp;·&nbsp;Ctrl+Enter to submit
          </span>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <button
              onClick={loadSample}
              disabled={loading}
              style={{
                background: "none",
                border: "1px solid var(--border-subtle)",
                borderRadius: "100px",
                color: "var(--text-secondary)",
                padding: "0.55rem 1.1rem",
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-glow)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              Load Sample
            </button>

            <button
              id="submit-btn"
              className="submit-btn"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Processing…
                </>
              ) : (
                <>
                  <span>⚡</span> Analyse
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
