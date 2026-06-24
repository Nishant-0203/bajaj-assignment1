import TreeRenderer from "./TreeRenderer";

export default function ResultCard({ item, index }) {
  const { root, tree, depth, has_cycle } = item;

  return (
    <article className={`glass-card hierarchy-item${has_cycle ? " cyclic" : ""}`}>
      <div className="hierarchy-header">
        <div className="hierarchy-root">
          <span>Root: {root}</span>
          <span className="root-badge">{has_cycle ? "Cycle" : "Tree"}</span>
        </div>
        {!has_cycle && depth !== undefined && (
          <span className="depth-badge">Depth {depth}</span>
        )}
      </div>

      {has_cycle ? (
        <div className="cycle-warning">
          <span>⚠️</span>
          <span>Cyclic component detected — no tree structure available.</span>
        </div>
      ) : (
        <TreeRenderer root={root} tree={tree} />
      )}
    </article>
  );
}
