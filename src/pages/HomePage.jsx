import { Link } from "react-router-dom";
import PromptDownloadButton from "../components/PromptDownloadButton";
import { courseChapters } from "../data/courseStructure";

export default function HomePage() {
  const latestChapter = courseChapters[courseChapters.length - 1];

  return (
    <div className="home-page">
      <section className="panel home-hero-banner">
        <div className="home-hero-copy">
          <p className="eyebrow">Embedded Academy</p>
          <h1>Learn the whole machine, not just isolated definitions</h1>
          <p className="hero-text">
            Move from bits and memory to clocks, buses, code generation, flash, RAM, execution, and
            revision games that connect the full picture together.
          </p>

          <div className="button-row">
            <Link className="primary-link" to={`/lesson/${courseChapters[0].slug}`}>
              Start from Chapter 1
            </Link>
            <Link className="secondary-link" to={`/lesson/${latestChapter.slug}`}>
              Open latest chapter
            </Link>
            <Link className="secondary-link" to="/abbreviations">
              Read abbreviations
            </Link>
          </div>
        </div>

        <div className="home-hero-summary">
          <div className="summary-row">
            <strong>{courseChapters.length}</strong>
            <span>Interactive chapters</span>
          </div>
          <div className="summary-row">
            <strong>Bits to buses to code to execution</strong>
            <span>One connected learning path</span>
          </div>
          <div className="summary-row">
            <strong>Games + explainers</strong>
            <span>Designed to teach reasoning, not rote memorization</span>
          </div>
        </div>
      </section>

      <section className="chapter-index-grid">
        {courseChapters.map((chapter) => (
          <article key={chapter.id} className="panel chapter-group-card">
            <div className="chapter-group-head">
              <span>{chapter.chapterLabel}</span>
              <h2>{chapter.title}</h2>
              <p className="panel-copy">{chapter.summary}</p>
            </div>

            <div className="chapter-card-actions">
              <Link className="chapter-lesson-card" to={`/lesson/${chapter.slug}`}>
                <strong>{chapter.chapterLabel}</strong>
                <span>{chapter.title}</span>
                <p>{chapter.summary}</p>
              </Link>

              <PromptDownloadButton
                slug={chapter.slug}
                label="Download Chapter .txt"
                className="secondary-link chapter-card-download"
              />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

