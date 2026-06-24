const EDGE_REGEX = /^[A-Z]->[A-Z]$/;

function validateEdge(raw) {
  if (typeof raw !== "string") return { valid: false, trimmed: String(raw) };

  const trimmed = raw.trim();

  if (!EDGE_REGEX.test(trimmed)) return { valid: false, trimmed };

  const [src, dst] = trimmed.split("->").map((c) => c.trim());
  if (src === dst) return { valid: false, trimmed };

  return { valid: true, trimmed, src, dst };
}

module.exports = { validateEdge };
