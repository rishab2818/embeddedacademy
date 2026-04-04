export default function RecapCheckpoint({ title = "Recap checkpoint", items = [], question }) {
  return (
    <section className="panel recap-checkpoint">
      <div className="panel-header stacked">
        <div>
          <p className="eyebrow">Recap checkpoint</p>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="lesson-support-grid recap-grid">
        {items.map((item) => (
          <article key={item} className="lesson-support-card recap-card">
            <span>Remember</span>
            <p>{item}</p>
          </article>
        ))}
      </div>

      {question ? (
        <div className="callout">
          <strong>Self-check question</strong>
          <span>{question}</span>
        </div>
      ) : null}
    </section>
  );
}
