import { Link } from "react-router-dom";

export default function LessonSupportPanel({ support }) {
  if (!support) {
    return null;
  }

  return (
    <section className="panel lesson-support-panel">
      <div className="panel-header stacked">
        <div>
          <p className="eyebrow">Easy Start</p>
          <h3>{support.title}</h3>
          <p className="panel-copy">{support.intro}</p>
        </div>
      </div>

      <div className="lesson-support-grid">
        {support.takeaways.map((item) => (
          <article key={item} className="lesson-support-card">
            <span>Key idea</span>
            <p>{item}</p>
          </article>
        ))}
      </div>

      <div className="callout">
        <strong>Common confusion to avoid</strong>
        <span>{support.watchOut}</span>
      </div>

      <div className="button-row">
        <Link className="secondary-link" to="/abbreviations">
          Open abbreviations page
        </Link>
      </div>
    </section>
  );
}
