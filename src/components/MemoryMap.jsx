export default function MemoryMap({ title, subtitle, cells, activeGroup, columns = 4 }) {
  return (
    <div className="memory-map-shell">
      <div className="memory-map-head">
        <strong>{title}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>

      <div className="memory-map-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {cells.map((cell) => {
          const isActive =
            activeGroup === undefined ||
            activeGroup === null ||
            cell.group === undefined ||
            cell.group === activeGroup;

          return (
            <div key={`${cell.address}-${cell.hex}`} className={`memory-map-cell ${isActive ? "active" : ""}`}>
              <span>{cell.addressLabel ?? `0x${cell.address.toString(16).toUpperCase()}`}</span>
              <strong>{cell.hex}</strong>
              {cell.note ? <small>{cell.note}</small> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
