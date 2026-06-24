/**
 * Validates a single edge entry against the required format.
 * Format: X->Y where X and Y are single uppercase A-Z characters, X !== Y.
 */

const EDGE_REGEX = /^[A-Z]->[A-Z]$/;

/**
 * @param {string} raw - raw string from input array
 * @returns {{ valid: boolean, trimmed: string }}
 */
function validateEdge(raw) {
  if (typeof raw !== "string") return { valid: false, trimmed: String(raw) };

  const trimmed = raw.trim();

  if (!EDGE_REGEX.test(trimmed)) return { valid: false, trimmed };

  // Reject self-loops: A->A
  const [src, dst] = trimmed.split("->").map((c) => c.trim());
  if (src === dst) return { valid: false, trimmed };

  return { valid: true, trimmed, src, dst };
}

module.exports = { validateEdge };
