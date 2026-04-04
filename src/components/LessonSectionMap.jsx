export default function LessonSectionMap({ chapter }) {
  if (!chapter?.sections?.length) {
    return null;
  }

  return (
    <section className="panel lesson-section-map">
      <div className="lesson-section-map-head">
        <div>
          <p className="eyebrow">Quick lesson map</p>
          <h3>Scan the chapter before you dive deep</h3>
        </div>
        <span className="chapter-resource-badge">{chapter.sections.length} stops</span>
      </div>

      <div className="lesson-section-map-grid">
        {chapter.sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className="lesson-section-map-link"
            onClick={() =>
              document.getElementById(section.id)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          >
            {section.label}
          </button>
        ))}
      </div>
    </section>
  );
}
