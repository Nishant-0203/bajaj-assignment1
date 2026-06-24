/**
 * Processes raw input into clean edge list:
 *   - Validates each entry
 *   - Removes true duplicates (same X->Y seen more than once)
 *   - Enforces single-parent rule (only first parent for any child)
 *
 * Returns:
 *   validEdges    : [{src, dst}]  — edges that pass all rules
 *   invalidEntries: [string]      — raw strings that fail validation
 *   duplicateEdges: [string]      — strings that are exact duplicates (stored once per dup set)
 */

const { validateEdge } = require("./validator");

function buildEdgeList(rawData) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const seenEdgeStrings = new Set(); // for exact-duplicate tracking
  const childParentMap = new Map(); // child -> first parent (single-parent rule)
  const validEdges = [];

  for (const raw of rawData) {
    const { valid, trimmed, src, dst } = validateEdge(raw);

    if (!valid) {
      invalidEntries.push(trimmed !== undefined ? trimmed : String(raw).trim());
      continue;
    }

    const key = `${src}->${dst}`;

    // Exact duplicate check
    if (seenEdgeStrings.has(key)) {
      if (!duplicateEdges.includes(key)) {
        duplicateEdges.push(key);
      }
      continue;
    }
    seenEdgeStrings.add(key);

    // Single-parent rule: if dst already has a parent, silently ignore this edge
    if (childParentMap.has(dst)) {
      continue;
    }

    childParentMap.set(dst, src);
    validEdges.push({ src, dst });
  }

  return { validEdges, invalidEntries, duplicateEdges };
}

module.exports = { buildEdgeList };
