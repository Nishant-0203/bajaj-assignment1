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
