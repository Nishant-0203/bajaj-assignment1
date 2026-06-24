const { buildEdgeList } = require("../utils/graphBuilder");
const { detectCycles } = require("../utils/cycleDetector");
const { buildTreeObject } = require("../utils/treeBuilder");
const { calculateDepth } = require("../utils/depthCalculator");

async function processHierarchy(req, res) {
  try {
    const { data } = req.body;

    // basic validation
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Request body must contain a 'data' array." });
    }

    const { validEdges, invalidEntries, duplicateEdges } = buildEdgeList(data);

    const adjacency = new Map();
    const allNodes = new Set();

    for (const { src, dst } of validEdges) {
      allNodes.add(src);
      allNodes.add(dst);
      if (!adjacency.has(src)) adjacency.set(src, []);
      adjacency.get(src).push(dst);
    }

    const nodeList = [...allNodes].sort(); // sort nodes for deterministic output

    const { cyclicNodes } = detectCycles(adjacency, nodeList);

    // union find
    const parent = new Map();
    const find = (x) => {
      while (parent.get(x) !== x) {
        parent.set(x, parent.get(parent.get(x)));
        x = parent.get(x);
      }
      return x;
    };
    const union = (a, b) => {
      const ra = find(a), rb = find(b);
      if (ra !== rb) parent.set(ra, rb);
    };

    for (const n of nodeList) parent.set(n, n);
    for (const { src, dst } of validEdges) union(src, dst);

    const components = new Map();
    for (const n of nodeList) {
      const root = find(n);
      if (!components.has(root)) components.set(root, []);
      components.get(root).push(n);
    }

    const hierarchies = [];
    let totalTrees = 0;
    let totalCycles = 0;
    let largestTreeRoot = null;
    let largestTreeDepth = -1;

    for (const [, nodes] of components) {
      const isCyclic = nodes.some((n) => cyclicNodes.has(n));

      if (isCyclic) {
        // handle pure cycles
        const cycleRoot = [...nodes].sort()[0];
        hierarchies.push({ root: cycleRoot, tree: {}, has_cycle: true });
        totalCycles++;
      } else {
        const childSet = new Set(validEdges.filter(({ src, dst }) =>
          nodes.includes(src) || nodes.includes(dst)
        ).map(({ dst }) => dst));

        const roots = nodes.filter((n) => !childSet.has(n)).sort();
        const treeRoot = roots[0] || nodes.sort()[0];

        const tree = buildTreeObject(treeRoot, adjacency);
        const depth = calculateDepth(treeRoot, adjacency);

        hierarchies.push({ root: treeRoot, tree: { [treeRoot]: tree }, depth });
        totalTrees++;

        if (
          depth > largestTreeDepth ||
          (depth === largestTreeDepth && treeRoot < largestTreeRoot)
        ) {
          largestTreeDepth = depth;
          largestTreeRoot = treeRoot;
        }
      }
    }

    hierarchies.sort((a, b) => {
      const ac = a.has_cycle === true;
      const bc = b.has_cycle === true;
      if (ac !== bc) return ac ? 1 : -1;
      return a.root.localeCompare(b.root);
    });

    return res.status(200).json({
      user_id: "nishantbhalla_32",
      email_id: "nishant2082.be23@chitkara.edu.in",
      college_roll_number: "2310992082",
      hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: {
        total_trees: totalTrees,
        total_cycles: totalCycles,
        largest_tree_root: largestTreeRoot ?? "",
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = { processHierarchy };
