function calculateDepth(root, adjacency) {
  let maxDepth = 1;

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
