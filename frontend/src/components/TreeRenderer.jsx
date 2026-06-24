/**
 * TreeRenderer — recursively renders a nested tree object as an indented
 * Unicode-branch structure (similar to the `tree` CLI command).
 */

const BRANCH = "├─";
const LAST   = "└─";

function TreeNode({ name, subtree, isLast = false, depth = 0 }) {
  const children = subtree ? Object.entries(subtree) : [];
  const isLeaf   = children.length === 0;
  const isRoot   = depth === 0;

  return (
    <div className="tree-node">
      <div className="tree-node-inner">
        {depth > 0 && (
          <span className="tree-branch-line">
            {isLast ? LAST : BRANCH}
          </span>
        )}
        <span className="tree-node-label">
          <span
            className="tree-node-icon"
            style={{
              color: isRoot
                ? "var(--accent-primary)"
                : isLeaf
                ? "var(--text-muted)"
                : "var(--accent-secondary)",
            }}
          >
            {isRoot ? "◈" : isLeaf ? "◆" : "◇"}
          </span>
          <span className={`tree-node-name${isLeaf && !isRoot ? " leaf" : ""}`}>
            {name}
          </span>
          {isRoot && (
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--accent-primary)",
                opacity: 0.7,
                marginLeft: 2,
              }}
            >
              root
            </span>
          )}
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
  const rootSubtree = tree?.[root] ?? {};

  return (
    <div className="tree-container">
      <div className="tree-root-wrapper">
        <TreeNode name={root} subtree={rootSubtree} isLast={false} depth={0} />
      </div>
    </div>
  );
}
