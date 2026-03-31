import PromptDownloadButton from "../components/PromptDownloadButton";
import { courseChapters } from "../data/courseStructure";

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="page-hero home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Embedded Programming Fundamentals</p>
          <h1>Open any chapter in a new tab and learn the stack in order</h1>
          <p className="hero-text">
            The course is now arranged as a clean sequence of chapters. Every chapter card opens
            in a new tab, every chapter page includes previous and next navigation, and every
            chapter also has a downloadable `.txt` prompt pack for deeper self-study with any LLM.
          </p>
        </div>

        <div className="panel home-feature-panel">
          <p className="eyebrow">What Changed</p>
          <h3>Cleaner flow, better self-study tools, and a simpler interface</h3>
          <div className="bullet-stack">
            <div className="bullet-card">Sequential chapter numbering across the active course.</div>
            <div className="bullet-card">New-tab chapter opening from the home page.</div>
            <div className="bullet-card">Downloadable chapter prompt packs for self-study with any external LLM.</div>
            <div className="bullet-card">Light and dark mode toggle available from the top bar.</div>
          </div>
        </div>
      </header>

      <section className="chapter-index-grid">
        {courseChapters.map((chapter) => (
          <article key={chapter.id} className="panel chapter-group-card">
            <div className="chapter-group-head">
              <span>{chapter.chapterLabel}</span>
              <h2>{chapter.title}</h2>
              <p className="panel-copy">{chapter.summary}</p>
            </div>

            <div className="chapter-card-actions">
              <a
                className="chapter-lesson-card"
                href={`#/lesson/${chapter.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{chapter.chapterLabel}</strong>
                <span>{chapter.title}</span>
                <p>{chapter.summary}</p>
              </a>

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
