export default function InteractionGuide({ title = "How to read this lab", items = [] }) {
  return (
    <section className="panel interaction-guide">
      <div className="panel-header stacked">
        <div>
          <p className="eyebrow">Interaction guide</p>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="teaching-step-grid compact">
        {items.map((item) => (
          <article key={item.title} className="teaching-step-card">
            <span>{item.title}</span>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
