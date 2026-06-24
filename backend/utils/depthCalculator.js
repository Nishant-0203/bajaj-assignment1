/**
 * Calculates the maximum depth (longest root-to-leaf path, counting nodes).
 *
 * Example: A->B->C = depth 3
 *
 * Uses iterative DFS to avoid stack overflow on deep trees.
 *
 * @param {string} root
 * @param {Map<string, string[]>} adjacency
 * @returns {number}
 */
function calculateDepth(root, adjacency) {
  let maxDepth = 1;

  // Stack stores [node, currentDepth]
  const stack = [[root, 1]];
  const visited = new Set();

  while (stack.length > 0) {
    const [node, depth] = stack.pop();

    if (visited.has(node)) continue;
    visited.add(node);

    if (depth > maxDepth) maxDepth = depth;

    const children = adjacency.get(node) || [];
    for (const child of children) {
      if (!visited.has(child)) {
        stack.push([child, depth + 1]);
      }
    }
  }

  return maxDepth;
}

module.exports = { calculateDepth };
