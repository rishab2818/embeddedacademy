import { useMemo, useState } from "react";

export default function DriverSnippetViewer({ eyebrow = "Driver reading", title, views, activeViewId }) {
  const [internalViewId, setInternalViewId] = useState(views[0]?.id ?? null);
  const currentId = activeViewId ?? internalViewId;
  const view = useMemo(
    () => views.find((item) => item.id === currentId) ?? views[0],
    [currentId, views]
  );

  return (
    <div className="panel clock-driver-panel">
      <p className="eyebrow">{eyebrow}</p>
      <h3>{title}</h3>

      <div className="button-row">
        {views.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`chip-button ${item.id === view.id ? "active" : ""}`}
            onClick={() => setInternalViewId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="callout">
        <strong>{view.title}</strong>
        <span>{view.explain}</span>
      </div>

      <div className="source-card pipeline-stage-card">
        {view.lines.map((line, index) => (
          <div key={`${view.id}-${index}`} className="source-line">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
