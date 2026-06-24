/**
 * Cycle Detector using iterative DFS (coloring approach).
 *
 * Colors: 0 = WHITE (unvisited), 1 = GRAY (in stack), 2 = BLACK (done)
 *
 * Returns:
 *   - Set of nodes that are part of at least one cycle (cyclic component).
 *   - Nodes NOT in a cycle are acyclic.
 */

/**
 * @param {Map<string, string[]>} adjacency  node -> [children]
 * @param {string[]} allNodes
 * @returns {{ cyclicNodes: Set<string> }}
 */
function detectCycles(adjacency, allNodes) {
  const color = new Map();
  for (const n of allNodes) color.set(n, 0); // WHITE

  const cyclicNodes = new Set();

  for (const start of allNodes) {
    if (color.get(start) !== 0) continue;

    // Iterative DFS with explicit stack tracking
    const stack = [{ node: start, childIndex: 0 }];
    const path = [start];
    const pathSet = new Set([start]);
    color.set(start, 1); // GRAY

    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const children = adjacency.get(frame.node) || [];

      if (frame.childIndex < children.length) {
        const child = children[frame.childIndex];
        frame.childIndex++;

        if (color.get(child) === 1) {
          // Back edge → cycle found; mark all nodes currently in the cycle path
          const cycleStart = path.indexOf(child);
          for (let i = cycleStart; i < path.length; i++) {
            cyclicNodes.add(path[i]);
          }
        } else if (color.get(child) === 0) {
          color.set(child, 1);
          path.push(child);
          pathSet.add(child);
          stack.push({ node: child, childIndex: 0 });
        }
      } else {
        // Done with this node
        color.set(frame.node, 2); // BLACK
        path.pop();
        pathSet.delete(frame.node);
        stack.pop();
      }
    }
  }

  return { cyclicNodes };
}

module.exports = { detectCycles };
