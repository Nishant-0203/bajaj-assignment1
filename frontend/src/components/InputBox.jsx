// sample data for quick testing
const SAMPLE = `A->B
A->C
B->D
C->E
E->F
X->Y
Y->Z
Z->X
P->Q
Q->R
G->H
G->H
G->I
hello
1->2
A->`;

export default function InputBox({ value, onChange, onSubmit, loading }) {
  // submit on ctrl+enter
  function handleKey(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <section className="input-section">
      <div className="glass-card input-card">

        <div className="input-top-row">
          <div className="input-label">
            <span className="input-label-dot" />
            Edge Input
          </div>
          <span className="input-format-hint">X→Y · one per line</span>
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
          rows={7}
        />

        <div className="input-footer">
          <span className="input-hint">
            Press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> to submit
          </span>
          <div className="btn-group">
            <button
              className="btn-ghost"
              onClick={() => onChange("")}
              disabled={loading || !value}
            >
              Clear
            </button>
            <button
              className="btn-ghost"
              onClick={() => onChange(SAMPLE)}
              disabled={loading}
              title="Load full assignment example"
            >
              ✦ Load Sample
            </button>

            <button
              id="submit-btn"
              className="submit-btn"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Analysing…
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
