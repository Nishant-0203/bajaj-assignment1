function detectCycles(adjacency, allNodes) {
  const color = new Map();
  for (const n of allNodes) color.set(n, 0);

  const cyclicNodes = new Set();

  for (const start of allNodes) {
    if (color.get(start) !== 0) continue;

    const stack = [{ node: start, childIndex: 0 }];
    const path = [start];
    const pathSet = new Set([start]);
    color.set(start, 1);

    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const children = adjacency.get(frame.node) || [];

      if (frame.childIndex < children.length) {
        const child = children[frame.childIndex];
        frame.childIndex++;

        if (color.get(child) === 1) {
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
        color.set(frame.node, 2);
        path.pop();
        pathSet.delete(frame.node);
        stack.pop();
      }
    }
  }

  return { cyclicNodes };
}

module.exports = { detectCycles };
