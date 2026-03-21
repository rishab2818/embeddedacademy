import { useEffect, useState } from "react";

export default function CodePipelineViewer({ stages, title }) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    setActiveStage(0);
  }, [stages]);

  const stage = stages[activeStage];

  return (
    <div className="panel code-pipeline-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Code ladder</p>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="button-row">
        {stages.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`chip-button ${index === activeStage ? "active" : ""}`}
            onClick={() => setActiveStage(index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="source-card pipeline-stage-card">
        {stage.lines.map((line) => (
          <div key={`${stage.id}-${line}`} className="source-line">
            {line}
          </div>
        ))}
      </div>

      <div className="callout">
        <strong>{stage.label}</strong>
        <span>{stage.explain}</span>
      </div>
    </div>
  );
}
