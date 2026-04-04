import { Link } from "react-router-dom";
import PromptDownloadButton from "./PromptDownloadButton";

export default function ChapterResourcePanel({ chapter }) {
  return (
    <div className="panel chapter-resource-panel">
      <div className="chapter-resource-head">
        <div>
          <p className="eyebrow">Chapter Toolkit</p>
          <h3>Stay oriented while you read</h3>
        </div>
        <span className="chapter-resource-badge">{chapter.sections.length} stops</span>
      </div>

      <p className="panel-copy">
        Jump to any section, open the glossary when a term feels unfamiliar, or download the prompt
        pack for self-study and follow-up questions.
      </p>

      <div className="chapter-resource-actions">
        <PromptDownloadButton
          slug={chapter.slug}
          label="Download prompt pack"
          className="primary-link chapter-download-button"
        />

        <Link className="secondary-link chapter-abbrev-link" to="/abbreviations">
          Open glossary
        </Link>
      </div>

      <div className="chapter-outline-list">
        {chapter.sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className="chapter-outline-link"
            onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}
