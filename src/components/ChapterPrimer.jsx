export default function ChapterPrimer({ eyebrow = "Before we dive in", title, items, callout }) {
  return (
    <div className="panel chapter-primer-panel">
      <div className="panel-header stacked">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="teaching-step-grid compact">
        {items.map((item) => (
          <div key={item.title} className="teaching-step-card">
            <span>{item.title}</span>
            <p>{item.body}</p>
          </div>
        ))}
      </div>

      {callout ? (
        <div className="callout">
          <strong>{callout.title}</strong>
          <span>{callout.body}</span>
        </div>
      ) : null}
    </div>
  );
}
