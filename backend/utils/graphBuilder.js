const { validateEdge } = require("./validator");

function buildEdgeList(rawData) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const seenEdgeStrings = new Set();
  const childParentMap = new Map();
  const validEdges = [];

  for (const raw of rawData) {
    const { valid, trimmed, src, dst } = validateEdge(raw);

    if (!valid) {
      invalidEntries.push(trimmed !== undefined ? trimmed : String(raw).trim());
      continue;
    }

    const key = `${src}->${dst}`;

    if (seenEdgeStrings.has(key)) {
      if (!duplicateEdges.includes(key)) {
        duplicateEdges.push(key);
      }
      continue;
    }
    seenEdgeStrings.add(key);

    if (childParentMap.has(dst)) {
      continue;
    }

    childParentMap.set(dst, src);
    validEdges.push({ src, dst });
  }

  return { validEdges, invalidEntries, duplicateEdges };
}

module.exports = { buildEdgeList };
