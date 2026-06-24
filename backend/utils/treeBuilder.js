/**
 * Recursively builds the nested tree object from the adjacency map.
 * Each node maps to an object of its children (which themselves do likewise).
 *
 * @param {string} node
 * @param {Map<string, string[]>} adjacency
 * @param {Set<string>} visited  — prevents infinite loops on any residual structure
 * @returns {Object}
 */
function buildTreeObject(node, adjacency, visited = new Set()) {
  if (visited.has(node)) return {};
  visited.add(node);

  const children = adjacency.get(node) || [];
  const subtree = {};

  for (const child of children) {
    subtree[child] = buildTreeObject(child, adjacency, visited);
  }

  return subtree;
}

module.exports = { buildTreeObject };
