import { Link } from "react-router-dom";
import ApiConfigPanel from "../components/ApiConfigPanel";
import { courseChapters } from "../data/courseStructure";

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="page-hero home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Embedded Programming Fundamentals</p>
          <h1>Choose a chapter and learn it on its own page</h1>
          <p className="hero-text">
            The home page now shows only chapters. Each lesson opens on a dedicated page with
            next/previous navigation, and you can enable a session-only chatbot using your own
            OpenAI, Gemini, or Claude API key.
          </p>
        </div>

        <ApiConfigPanel />
      </header>

      <section className="chapter-index-grid">
        {courseChapters.map((chapter) => (
          <article key={chapter.id} className="panel chapter-group-card">
            <div className="chapter-group-head">
              <span>Chapter {chapter.number}</span>
              <h2>{chapter.title}</h2>
              <p className="panel-copy">{chapter.summary}</p>
            </div>

            <div className="chapter-lesson-list">
              {chapter.lessons.map((lesson) => (
                <Link key={lesson.id} className="chapter-lesson-card" to={`/lesson/${lesson.slug}`}>
                  <strong>{lesson.chapterLabel}</strong>
                  <span>{lesson.title}</span>
                  <p>{lesson.summary}</p>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
