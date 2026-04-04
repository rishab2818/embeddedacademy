export default function DeepDiveBlock({ title, summary, points = [], children }) {
  return (
    <details className="panel deep-dive-block">
      <summary className="deep-dive-summary">
        <div>
          <span>Deep dive</span>
          <strong>{title}</strong>
        </div>
        <small>{summary}</small>
      </summary>

      <div className="deep-dive-content">
        {points.length ? (
          <div className="teaching-step-grid compact">
            {points.map((point) => (
              <article key={point.title} className="teaching-step-card">
                <span>{point.title}</span>
                <p>{point.body}</p>
              </article>
            ))}
          </div>
        ) : null}

        {children}
      </div>
    </details>
  );
}
