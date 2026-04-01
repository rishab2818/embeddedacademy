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
