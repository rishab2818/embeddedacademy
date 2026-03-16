export default function Sidebar({ chapters }) {
  return (
    <aside className="sidebar">
      <a href="#top" className="sidebar-brand">
        <span className="brand-mark">EP</span>
        <div>
          <strong>Embedded Path</strong>
          <p>Chapter-wise learning</p>
        </div>
      </a>

      <div className="sidebar-stack">
        {chapters.map((chapter) => (
          <nav key={chapter.id} className="sidebar-card">
            <a href={`#${chapter.id}`} className="sidebar-card-head">
              <span>{chapter.number}</span>
              <div>
                <strong>{chapter.title}</strong>
                <p>{chapter.summary}</p>
              </div>
            </a>

            <div className="sidebar-links">
              {chapter.sections.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  {section.label}
                </a>
              ))}
            </div>
          </nav>
        ))}
      </div>
    </aside>
  );
}
