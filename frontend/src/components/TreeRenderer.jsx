/**
 * TreeRenderer — recursively renders a nested tree object as an indented
 * Unicode-branch structure (similar to the `tree` CLI command).
 */

const ICONS = {
  branch: "├─",
  last:   "└─",
  leaf:   "◆",
  node:   "◇",
};

function TreeNode({ name, subtree, isLast = false, depth = 0 }) {
  const children = subtree ? Object.entries(subtree) : [];
  const isLeaf = children.length === 0;

  return (
    <div className="tree-node">
      <div className="tree-node-inner">
        {depth > 0 && (
          <span className="tree-branch-line">
            {isLast ? ICONS.last : ICONS.branch}
          </span>
        )}
        <span className="tree-node-label">
          <span style={{ fontSize: "0.65rem", color: isLeaf ? "var(--text-muted)" : "var(--accent-primary)" }}>
            {isLeaf ? ICONS.leaf : ICONS.node}
          </span>
          <span className={`tree-node-name${isLeaf ? " leaf" : ""}`}>{name}</span>
        </span>
      </div>

      {children.length > 0 && (
        <div className="tree-children">
          {children.map(([childName, childSubtree], idx) => (
            <TreeNode
              key={childName}
              name={childName}
              subtree={childSubtree}
              isLast={idx === children.length - 1}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeRenderer({ root, tree }) {
  // tree = { "A": { "B": { ... }, "C": { ... } } }
  const rootSubtree = tree?.[root] ?? {};

  return (
    <div className="tree-container">
      <div className="tree-root-wrapper">
        <TreeNode name={root} subtree={rootSubtree} isLast={false} depth={0} />
      </div>
    </div>
  );
}
