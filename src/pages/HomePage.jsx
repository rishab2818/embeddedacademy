import { Link } from "react-router-dom";
import PromptDownloadButton from "../components/PromptDownloadButton";
import { courseChapters, phaseMeta } from "../data/courseStructure";

export default function HomePage() {
  const latestChapter = courseChapters[courseChapters.length - 1];
  const totalSections = courseChapters.reduce((sum, chapter) => sum + chapter.sections.length, 0);
  const learningStages = [
    { id: "foundations", ...phaseMeta.foundations },
    { id: "systems", ...phaseMeta.systems },
    { id: "revision", ...phaseMeta.revision },
  ].map((stage) => ({
    ...stage,
    chapterCount: courseChapters.filter((chapter) => chapter.phase === stage.id).length,
  }));

  return (
    <div className="home-page">
      <section className="panel home-hero-banner">
        <div className="home-hero-copy">
          <p className="eyebrow">Embedded Academy</p>
          <h1>Learn embedded systems as one connected story across every screen size</h1>
          <p className="hero-text">
            Move from bits and memory to buses, timing, compilation, flash, RAM, execution, and
            revision labs without losing the thread. The course is organized to feel cleaner,
            calmer, and easier to navigate on phone, tablet, and desktop.
          </p>

          <div className="button-row">
            <Link className="primary-link" to={`/lesson/${courseChapters[0].slug}`}>
              Start Chapter 1
            </Link>
            <Link className="secondary-link" to={`/lesson/${latestChapter.slug}`}>
              Jump to latest
            </Link>
            <Link className="secondary-link" to="/abbreviations">
              Open glossary
            </Link>
          </div>

          <div className="home-highlight-grid">
            <article className="home-highlight-card">
              <strong>{courseChapters.length}</strong>
              <span>guided chapters</span>
            </article>
            <article className="home-highlight-card">
              <strong>{totalSections}</strong>
              <span>guided stops</span>
            </article>
            <article className="home-highlight-card">
              <strong>3 phases</strong>
              <span>foundation, system flow, revision</span>
            </article>
          </div>
        </div>

        <div className="home-hero-side">
          <div className="home-hero-summary">
            <div className="summary-row">
              <strong>Bits to buses to execution</strong>
              <span>One learning path instead of disconnected topics</span>
            </div>
            <div className="summary-row">
              <strong>Interactive labs and revision chapters</strong>
              <span>Designed to build reasoning, not rote memory</span>
            </div>
            <div className="summary-row">
              <strong>Glossary and prompt packs included</strong>
              <span>Quick support whenever a term or chapter feels heavy</span>
            </div>
          </div>

          <div className="panel home-path-panel">
            <p className="eyebrow">Learning Path</p>
            <div className="home-path-list">
              {learningStages.map((stage, index) => (
                <article key={stage.title} className={`home-path-step phase-${stage.id}`}>
                  <span>Step {index + 1}</span>
                  <strong>{stage.title}</strong>
                  <p>{stage.blurb}</p>
                  <small>{stage.chapterCount} chapters</small>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section-head">
        <div>
          <p className="eyebrow">Course Map</p>
          <h2>Browse the chapters in a cleaner, faster layout</h2>
        </div>
        <p className="panel-copy">
          Every chapter card shows the focus, the section count, and the quickest way to continue reading or download a study prompt.
        </p>
      </section>

      <section className="chapter-index-grid">
        {courseChapters.map((chapter) => (
          <article key={chapter.id} className={`panel chapter-group-card lesson-phase-${chapter.phase}`}>
            <div className="chapter-card-top">
              <div className="chapter-card-kicker-row">
                <span className="chapter-card-kicker">{chapter.chapterLabel}</span>
                <span className={`chapter-phase-pill phase-${chapter.phase}`}>
                  {phaseMeta[chapter.phase].shortLabel}
                </span>
              </div>
              <h2>{chapter.title}</h2>
              <p className="panel-copy">{chapter.summary}</p>
            </div>

            <div className="chapter-section-tags">
              <span className="chapter-card-count">{chapter.sections.length} sections</span>
              {chapter.sections.slice(0, 1).map((section) => (
                <span key={section.id} className="chapter-section-tag">
                  {section.label}
                </span>
              ))}
              {chapter.sections.length > 1 ? (
                <span className="chapter-section-tag chapter-section-tag-muted">
                  +{chapter.sections.length - 1} more stops
                </span>
              ) : null}
            </div>

            <div className="chapter-card-actions">
              <Link className="primary-link chapter-card-primary" to={`/lesson/${chapter.slug}`}>
                Open chapter
              </Link>
              <PromptDownloadButton
                slug={chapter.slug}
                label="Download prompt"
                className="secondary-link chapter-card-download"
              />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
